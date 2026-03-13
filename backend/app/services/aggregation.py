"""
Aggregation Server Module

Implements Trimmed Mean and Median aggregation strategies for
combining model updates from multiple bank nodes in a Byzantine-tolerant manner.
"""
import pickle
import numpy as np
from typing import Optional

from sklearn.ensemble import GradientBoostingClassifier

from app.services.federated_learning import _bank_updates, get_participating_banks
from app.services.fraud_model import save_model, load_model
from app.utils.encryption import decrypt_update
from app.utils.logger import get_logger

logger = get_logger(__name__)


def _extract_feature_importances(model) -> np.ndarray:
    """Extract feature importances from a sklearn ensemble model."""
    if hasattr(model, "feature_importances_"):
        return model.feature_importances_
    return np.array([])


def aggregate_weights_trimmed_mean(trim_ratio: float = 0.1) -> dict:
    """
    Aggregate model updates using Trimmed Mean.
    Removes the top and bottom `trim_ratio` fraction of values per feature.
    Provides robustness against poisoning attacks.
    """
    banks = get_participating_banks()
    if len(banks) < 2:
        return {"error": "Need at least 2 bank updates to aggregate"}

    importances = []
    for bank_id in banks:
        raw_weights = _bank_updates.get(bank_id)
        if raw_weights is None:
            continue
        model = pickle.loads(raw_weights)
        fi = _extract_feature_importances(model)
        if len(fi) > 0:
            importances.append(fi)

    if len(importances) < 2:
        return {"error": "Insufficient valid model weights for aggregation"}

    # Stack and trim
    stacked = np.stack(importances)
    n = stacked.shape[0]
    trim_count = max(1, int(n * trim_ratio))

    sorted_arr = np.sort(stacked, axis=0)
    trimmed = sorted_arr[trim_count : n - trim_count]

    if trimmed.shape[0] == 0:
        trimmed = sorted_arr  # fallback if too few models

    mean_importances = np.mean(trimmed, axis=0)

    logger.info(
        f"Trimmed Mean aggregation: {len(banks)} banks, "
        f"trimmed {trim_count} from each end"
    )

    return {
        "method": "trimmed_mean",
        "banks_aggregated": len(banks),
        "aggregated_importances": mean_importances.tolist(),
        "status": "AGGREGATION_COMPLETE",
    }


def aggregate_weights_median() -> dict:
    """
    Aggregate model updates using Coordinate-wise Median.
    More robust than mean against Byzantine participants.
    """
    banks = get_participating_banks()
    if len(banks) < 2:
        return {"error": "Need at least 2 bank updates to aggregate"}

    importances = []
    for bank_id in banks:
        raw_weights = _bank_updates.get(bank_id)
        if raw_weights is None:
            continue
        model = pickle.loads(raw_weights)
        fi = _extract_feature_importances(model)
        if len(fi) > 0:
            importances.append(fi)

    if len(importances) < 2:
        return {"error": "Insufficient valid model weights"}

    stacked = np.stack(importances)
    median_importances = np.median(stacked, axis=0)

    logger.info(f"Median aggregation: {len(banks)} banks")

    return {
        "method": "median",
        "banks_aggregated": len(banks),
        "aggregated_importances": median_importances.tolist(),
        "status": "AGGREGATION_COMPLETE",
    }


def update_global_model(method: str = "trimmed_mean") -> dict:
    """
    Run aggregation and update the global model.
    For the demo, we retrain a fresh model using all available data
    (simulating the effect of improved global intelligence).
    """
    if method == "median":
        agg_result = aggregate_weights_median()
    else:
        agg_result = aggregate_weights_trimmed_mean()

    if "error" in agg_result:
        return agg_result

    # In a real FL system, we would blend the aggregated weights into the global model.
    # For demo, we retrain the global model (simulating improved accuracy from federated data).
    from app.services.fraud_model import train_model
    train_result = train_model()

    logger.info("Global model updated after federated aggregation")

    return {
        "aggregation": agg_result,
        "global_model_update": train_result,
        "status": "GLOBAL_MODEL_UPDATED",
    }
