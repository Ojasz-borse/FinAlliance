"""
Federated Learning Simulation

Simulates the federated learning workflow where each bank trains a local model
on its partition of data, then sends encrypted model updates to the server.
"""
import pickle
import numpy as np
import pandas as pd
from typing import Dict, List, Optional

from app.services.fraud_model import (
    load_dataset, feature_engineering, save_model, load_model, train_model as train_global,
    MERCHANT_CATEGORIES, LOCATIONS,
)
from app.utils.encryption import encrypt_update, decrypt_update
from app.utils.logger import get_logger

from sklearn.ensemble import GradientBoostingClassifier

logger = get_logger(__name__)

# In-memory store for bank model updates (simulated)
_bank_updates: Dict[str, bytes] = {}


def train_local_model(bank_id: str = "BANK_A") -> dict:
    """
    Train a local model using only one bank's data partition.
    In a real system, this runs on the bank's private infrastructure.
    """
    dataset = load_dataset()
    bank_data = dataset[dataset["bank_id"] == bank_id].copy()

    if len(bank_data) < 10:
        # If partition too small, use a random sample for demo
        bank_data = dataset.sample(n=min(100, len(dataset)), random_state=42)
        logger.warning(f"Bank {bank_id} data too small, using sample of {len(bank_data)} rows")

    features = feature_engineering(bank_data)
    labels = bank_data["is_fraud"].astype(int)

    model = GradientBoostingClassifier(
        n_estimators=50, max_depth=4, learning_rate=0.1, random_state=42
    )
    model.fit(features, labels)

    accuracy = model.score(features, labels)
    logger.info(f"[{bank_id}] Local model trained — accuracy {accuracy:.4f} on {len(bank_data)} samples")

    # Store weights
    weight_bytes = pickle.dumps(model)
    _bank_updates[bank_id] = weight_bytes

    return {
        "bank_id": bank_id,
        "samples_used": len(bank_data),
        "local_accuracy": round(accuracy, 4),
        "status": "LOCAL_TRAINING_COMPLETE",
    }


def extract_model_weights(bank_id: str) -> Optional[bytes]:
    """Retrieve stored model weights for a bank."""
    return _bank_updates.get(bank_id)


def send_update(bank_id: str) -> dict:
    """
    Encrypt and 'send' local model update to the aggregation server.
    In a real system this would be an HTTP call to a central server.
    """
    weights = _bank_updates.get(bank_id)
    if weights is None:
        return {"error": f"No local model found for {bank_id}. Train first."}

    encrypted = encrypt_update(weights)
    # Store the encrypted version (simulating server receipt)
    _bank_updates[f"{bank_id}_encrypted"] = encrypted

    logger.info(f"[{bank_id}] Encrypted update sent ({len(encrypted)} bytes)")
    return {
        "bank_id": bank_id,
        "bytes_sent": len(encrypted),
        "status": "UPDATE_SENT",
    }


def receive_global_model() -> bytes:
    """Download the current global model weights."""
    model = load_model()
    return pickle.dumps(model)


def get_participating_banks() -> List[str]:
    """Return list of banks that have submitted updates."""
    return [k for k in _bank_updates.keys() if not k.endswith("_encrypted")]
