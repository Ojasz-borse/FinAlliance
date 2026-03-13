import pickle
from fastapi import APIRouter
from fastapi.responses import Response

from app.services.federated_learning import (
    train_local_model,
    send_update,
    receive_global_model,
    get_participating_banks,
)
from app.services.aggregation import update_global_model

router = APIRouter(prefix="/federated", tags=["Federated Learning"])


@router.post("/train-local")
def train_local(bank_id: str = "BANK_A"):
    """Train a local fraud model on a single bank's data partition."""
    result = train_local_model(bank_id)
    return result


@router.post("/send-update")
def send_model_update(bank_id: str = "BANK_A"):
    """Encrypt and send local model update to the aggregation server."""
    result = send_update(bank_id)
    return result


@router.post("/aggregate")
def aggregate(method: str = "trimmed_mean"):
    """
    Aggregate all received bank model updates into a new global model.
    Methods: 'trimmed_mean' or 'median'
    """
    result = update_global_model(method=method)
    return result


@router.get("/global-model")
def download_global_model():
    """Download the current global model as a binary file."""
    model_bytes = receive_global_model()
    return Response(
        content=model_bytes,
        media_type="application/octet-stream",
        headers={"Content-Disposition": "attachment; filename=global_model.pkl"},
    )


@router.get("/status")
def federated_status():
    """Get current federated learning cluster status."""
    banks = get_participating_banks()
    return {
        "status": "IDLE" if len(banks) == 0 else "READY",
        "current_round": 1,
        "total_rounds": 5,
        "participating_banks": banks,
        "global_accuracy": 0.0,
    }
