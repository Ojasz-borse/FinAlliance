"""
Trainer Routes — Teachable Machine-style API for interactive model training.

Allows users to:
1. Add labeled transaction samples to classes
2. Train a model with custom hyperparameters
3. Predict on a test transaction
"""
import pickle
from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter

from app.services.fraud_model import (
    feature_engineering, save_model, load_model,
    MERCHANT_CATEGORIES, LOCATIONS,
)
from app.utils.logger import get_logger

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier

logger = get_logger(__name__)
router = APIRouter(prefix="/trainer", tags=["Model Trainer"])

# ── In-memory sample store ──────────────────────────────────────

_classes: dict = {
    "Legitimate": [],
    "Fraudulent": [],
}

_trainer_model = None
_trainer_accuracy = 0.0
_training_status = "IDLE"


# ── Schemas ─────────────────────────────────────────────────────

class SampleTransaction(BaseModel):
    amount: float
    merchant_category: str
    location: str
    timestamp: str


class AddSamplesRequest(BaseModel):
    class_name: str
    samples: List[SampleTransaction]


class TrainRequest(BaseModel):
    model_config = {"protected_namespaces": ()}
    model_type: str = "gradient_boosting"  # or "random_forest"
    n_estimators: int = 100
    max_depth: int = 5
    learning_rate: float = 0.1


class PredictRequest(BaseModel):
    amount: float
    merchant_category: str
    location: str
    timestamp: str


class AddClassRequest(BaseModel):
    class_name: str


# ── Routes ──────────────────────────────────────────────────────

@router.get("/classes")
def get_classes():
    """Get all classes and their sample counts."""
    result = {}
    for name, samples in _classes.items():
        result[name] = {
            "count": len(samples),
            "samples": samples[-5:],  # return last 5 for preview
        }
    return {"classes": result, "status": _training_status, "accuracy": _trainer_accuracy}


@router.post("/add-class")
def add_class(payload: AddClassRequest):
    """Add a new transaction class."""
    if payload.class_name in _classes:
        return {"error": f"Class '{payload.class_name}' already exists"}
    _classes[payload.class_name] = []
    return {"message": f"Class '{payload.class_name}' created", "classes": list(_classes.keys())}


@router.post("/add-samples")
def add_samples(payload: AddSamplesRequest):
    """Add labeled transaction samples to a class."""
    if payload.class_name not in _classes:
        _classes[payload.class_name] = []

    for s in payload.samples:
        _classes[payload.class_name].append({
            "amount": s.amount,
            "merchant_category": s.merchant_category,
            "location": s.location,
            "timestamp": s.timestamp,
        })

    count = len(_classes[payload.class_name])
    logger.info(f"Added {len(payload.samples)} samples to '{payload.class_name}' (total: {count})")
    return {
        "class_name": payload.class_name,
        "total_samples": count,
        "status": "SAMPLES_ADDED",
    }


@router.post("/generate-samples")
def generate_samples(class_name: str = "Legitimate", count: int = 20):
    """Auto-generate sample transaction data for a class."""
    rng = np.random.RandomState(hash(class_name) % 2**31)

    if class_name not in _classes:
        _classes[class_name] = []

    is_fraud = class_name.lower() in ["fraudulent", "fraud", "suspicious"]

    generated_samples = []

    for _ in range(count):
        if is_fraud:
            amount = float(np.round(rng.exponential(8000), 2))
            merchant = rng.choice(["crypto", "electronics", "transfer"])
            hour = rng.choice([0, 1, 2, 3, 4, 23, 22])
        else:
            amount = float(np.round(rng.exponential(200), 2))
            merchant = rng.choice(MERCHANT_CATEGORIES)
            hour = rng.randint(8, 20)

        location = rng.choice(LOCATIONS)
        ts = f"2026-03-{rng.randint(1,28):02d}T{hour:02d}:{rng.randint(0,59):02d}:00"

        sample = {
            "amount": amount,
            "merchant_category": str(merchant),
            "location": str(location),
            "timestamp": ts,
        }
        _classes[class_name].append(sample)
        generated_samples.append(sample)

    total = len(_classes[class_name])
    logger.info(f"Generated {count} samples for '{class_name}' (total: {total})")
    return {"class_name": class_name, "generated": count, "total_samples": total, "samples": generated_samples}


@router.post("/train")
def train_model(payload: TrainRequest):
    """Train a fraud detection model from the labeled samples."""
    global _trainer_model, _trainer_accuracy, _training_status

    _training_status = "TRAINING"

    # Build the dataset from all classes
    rows = []
    labels = []
    class_names = list(_classes.keys())

    for idx, (cls_name, samples) in enumerate(_classes.items()):
        for s in samples:
            rows.append(s)
            labels.append(idx)

    if len(rows) < 4:
        _training_status = "ERROR"
        return {"error": "Need at least 4 total samples across classes to train"}

    df = pd.DataFrame(rows)
    y = np.array(labels)

    # Check we have at least 2 classes
    unique_labels = np.unique(y)
    if len(unique_labels) < 2:
        _training_status = "ERROR"
        return {"error": "Need samples in at least 2 classes to train"}

    features = feature_engineering(df)

    # Choose model
    if payload.model_type == "random_forest":
        model = RandomForestClassifier(
            n_estimators=payload.n_estimators,
            max_depth=payload.max_depth,
            random_state=42,
            n_jobs=-1,
        )
    else:
        model = GradientBoostingClassifier(
            n_estimators=payload.n_estimators,
            max_depth=payload.max_depth,
            learning_rate=payload.learning_rate,
            random_state=42,
        )

    model.fit(features, y)
    accuracy = float(model.score(features, y))

    _trainer_model = model
    _trainer_accuracy = round(accuracy, 4)
    _training_status = "TRAINED"

    logger.info(f"Trainer model trained: {payload.model_type}, accuracy={accuracy:.4f}, samples={len(rows)}")

    return {
        "model_type": payload.model_type,
        "accuracy": _trainer_accuracy,
        "total_samples": len(rows),
        "classes": {name: len(samples) for name, samples in _classes.items()},
        "status": "TRAINED",
    }


@router.post("/predict")
def predict(payload: PredictRequest):
    """Predict class probabilities for a test transaction."""
    global _trainer_model

    if _trainer_model is None:
        return {"error": "No model trained yet. Train first."}

    df = pd.DataFrame([{
        "amount": payload.amount,
        "merchant_category": payload.merchant_category,
        "location": payload.location,
        "timestamp": payload.timestamp,
    }])

    features = feature_engineering(df)
    probas = _trainer_model.predict_proba(features)[0]

    class_names = list(_classes.keys())
    results = {}
    for i, cls_name in enumerate(class_names):
        if i < len(probas):
            results[cls_name] = round(float(probas[i]), 4)
        else:
            results[cls_name] = 0.0

    predicted_idx = int(np.argmax(probas))
    predicted_class = class_names[predicted_idx] if predicted_idx < len(class_names) else "Unknown"

    # Determine risk level
    fraud_prob = results.get("Fraudulent", results.get("Fraud", 0.0))
    if fraud_prob >= 0.75:
        risk = "HIGH"
    elif fraud_prob >= 0.4:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return {
        "probabilities": results,
        "predicted_class": predicted_class,
        "risk_level": risk,
    }


@router.get("/status")
def trainer_status():
    """Get the current trainer status."""
    return {
        "status": _training_status,
        "accuracy": _trainer_accuracy,
        "classes": {name: len(samples) for name, samples in _classes.items()},
        "model_loaded": _trainer_model is not None,
    }


@router.post("/reset")
def reset_trainer():
    """Reset all classes and model."""
    global _classes, _trainer_model, _trainer_accuracy, _training_status
    _classes = {"Legitimate": [], "Fraudulent": []}
    _trainer_model = None
    _trainer_accuracy = 0.0
    _training_status = "IDLE"
    return {"message": "Trainer reset", "status": "IDLE"}
