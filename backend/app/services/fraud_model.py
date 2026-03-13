"""
Fraud Detection ML Pipeline

Implements feature engineering, model training (RandomForest + GradientBoosting),
and prediction for the FinAlliance federated fraud detection system.
"""
import os
import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from typing import Dict
from sklearn.preprocessing import LabelEncoder
from app.utils.logger import get_logger
from app.config import settings

logger = get_logger(__name__)

# In-memory label encoders
_label_encoders: Dict[str, LabelEncoder] = {}
_model = None


# ── Feature Engineering ────────────────────────────────────────

MERCHANT_CATEGORIES = [
    "electronics", "retail", "travel", "dining", "crypto",
    "transfer", "groceries", "entertainment", "healthcare", "utilities",
]

LOCATIONS = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad",
    "New York", "London", "Singapore", "Dubai", "Shanghai",
]


def _prepare_encoders():
    """Initialize label encoders with known categories."""
    global _label_encoders
    if "merchant" not in _label_encoders:
        enc_m = LabelEncoder()
        enc_m.fit(MERCHANT_CATEGORIES)
        _label_encoders["merchant"] = enc_m

        enc_l = LabelEncoder()
        enc_l.fit(LOCATIONS)
        _label_encoders["location"] = enc_l


def feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    """
    Transform raw transaction data into ML features.
    
    Features:
    - amount (log-transformed)
    - merchant_category (label encoded)
    - location (label encoded)
    - hour of day
    - day of week
    - is_weekend
    - amount_zscore (deviation from mean)
    """
    _prepare_encoders()
    features = pd.DataFrame()

    # Amount features
    features["amount"] = np.log1p(df["amount"].astype(float))
    features["amount_raw"] = df["amount"].astype(float)

    # Categorical encoding — handle unseen categories gracefully
    def safe_encode(encoder: LabelEncoder, values: pd.Series) -> np.ndarray:
        known = set(encoder.classes_)
        return np.array([
            encoder.transform([v])[0] if v in known else -1
            for v in values
        ])

    features["merchant_encoded"] = safe_encode(
        _label_encoders["merchant"], df["merchant_category"]
    )
    features["location_encoded"] = safe_encode(
        _label_encoders["location"], df["location"]
    )

    # Temporal features
    timestamps = pd.to_datetime(df["timestamp"])
    features["hour"] = timestamps.dt.hour
    features["day_of_week"] = timestamps.dt.dayofweek
    features["is_weekend"] = (timestamps.dt.dayofweek >= 5).astype(int)

    # Statistical features
    mean_amt = features["amount_raw"].mean()
    std_amt = features["amount_raw"].std()
    # Handle single-row case where std is NaN
    if pd.isna(std_amt) or std_amt == 0:
        features["amount_zscore"] = 0.0
    else:
        features["amount_zscore"] = (
            (features["amount_raw"] - mean_amt) / (std_amt + 1e-8)
        )

    features.drop(columns=["amount_raw"], inplace=True)
    return features


# ── Dataset Loading ────────────────────────────────────────────

def load_dataset(csv_path: str = "data/sample_transactions.csv") -> pd.DataFrame:
    """Load the sample transaction CSV."""
    if not os.path.exists(csv_path):
        logger.warning(f"Dataset not found at {csv_path}, generating in-memory data")
        return _generate_synthetic_data()
    df = pd.read_csv(csv_path)
    logger.info(f"Loaded {len(df)} transactions from {csv_path}")
    return df


def _generate_synthetic_data(n: int = 500) -> pd.DataFrame:
    """Generate synthetic fraud data for training if CSV is missing."""
    rng = np.random.RandomState(42)
    data = {
        "transaction_id": [f"TX{str(i).zfill(6)}" for i in range(n)],
        "bank_id": rng.choice(["BANK_A", "BANK_B", "BANK_C", "BANK_D"], n),
        "amount": np.round(rng.exponential(500, n), 2),
        "merchant_category": rng.choice(MERCHANT_CATEGORIES, n),
        "location": rng.choice(LOCATIONS, n),
        "timestamp": pd.date_range("2025-01-01", periods=n, freq="h").astype(str),
        "is_fraud": rng.choice([0, 1], n, p=[0.85, 0.15]),
    }
    return pd.DataFrame(data)


# ── Model Training ─────────────────────────────────────────────

def train_model(
    data: pd.DataFrame = None,
    model_type: str = "gradient_boosting",
) -> dict:
    """Train a fraud detection model and save it."""
    global _model

    if data is None:
        data = load_dataset()

    features = feature_engineering(data)
    labels = data["is_fraud"].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        features, labels, test_size=0.2, random_state=42, stratify=labels
    )

    if model_type == "random_forest":
        model = RandomForestClassifier(
            n_estimators=100, max_depth=10, random_state=42, n_jobs=-1
        )
    else:
        model = GradientBoostingClassifier(
            n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42
        )

    model.fit(X_train, y_train)
    accuracy = model.score(X_test, y_test)
    _model = model

    logger.info(f"Trained {model_type} model — accuracy: {accuracy:.4f}")

    save_model(model)

    return {
        "model_type": model_type,
        "accuracy": round(accuracy, 4),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
    }


# ── Model Persistence ──────────────────────────────────────────

def save_model(model, path: str = None):
    """Serialize model to disk."""
    path = path or settings.MODEL_PATH
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        pickle.dump(model, f)
    logger.info(f"Model saved to {path}")


def load_model(path: str = None):
    """Load model from disk, or train a new one if missing."""
    global _model
    path = path or settings.MODEL_PATH

    if _model is not None:
        return _model

    if os.path.exists(path):
        with open(path, "rb") as f:
            _model = pickle.load(f)
        logger.info(f"Model loaded from {path}")
    else:
        logger.info("No saved model found — training a new one")
        train_model()

    return _model


# ── Prediction ─────────────────────────────────────────────────

def predict_fraud(
    amount: float,
    merchant_category: str,
    location: str,
    timestamp: str,
) -> dict:
    """
    Run fraud prediction on a single transaction.
    Returns fraud_probability and risk_level.
    """
    model = load_model()

    # Build a single-row DataFrame
    tx = pd.DataFrame([{
        "amount": amount,
        "merchant_category": merchant_category,
        "location": location,
        "timestamp": timestamp,
    }])

    features = feature_engineering(tx)
    prob = float(model.predict_proba(features)[0][1])

    if prob >= 0.75:
        risk = "HIGH"
    elif prob >= 0.4:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    logger.info(f"Prediction: amount={amount}, prob={prob:.3f}, risk={risk}")
    return {"fraud_probability": round(prob, 4), "risk_level": risk}


def get_model_weights() -> bytes:
    """Serialize the current model weights to bytes."""
    model = load_model()
    return pickle.dumps(model)


def set_model_from_weights(weight_bytes: bytes):
    """Deserialize model from bytes."""
    global _model
    _model = pickle.loads(weight_bytes)
    save_model(_model)
    logger.info("Model updated from received weights")
