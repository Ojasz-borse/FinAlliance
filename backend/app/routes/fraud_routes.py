from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.transaction import Transaction
from app.models.fraud_case import FraudCase
from app.schemas.fraud_schema import FraudPredictRequest, FraudPredictResponse, FraudCaseResponse
from app.services.fraud_model import predict_fraud
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/fraud", tags=["Fraud Detection"])


@router.post("/predict", response_model=FraudPredictResponse)
def predict(payload: FraudPredictRequest, db: Session = Depends(get_db)):
    """
    Predict fraud probability for a transaction.
    If the score exceeds the threshold, a FraudCase is automatically created.
    """
    try:
        result = predict_fraud(
            amount=payload.amount,
            merchant_category=payload.merchant_category,
            location=payload.location,
            timestamp=payload.timestamp,
        )

        # Parse the timestamp string to a datetime object for the DB model
        try:
            parsed_ts = datetime.fromisoformat(payload.timestamp)
        except (ValueError, TypeError):
            parsed_ts = datetime.utcnow()

        # Persist the transaction
        tx = Transaction(
            bank_id=payload.bank_id,
            amount=payload.amount,
            merchant_category=payload.merchant_category,
            location=payload.location,
            timestamp=parsed_ts,
            is_fraud_label=result["risk_level"] == "HIGH",
        )
        db.add(tx)
        db.commit()
        db.refresh(tx)

        # Auto-create fraud case if high risk
        if result["fraud_probability"] >= settings.FRAUD_THRESHOLD:
            fraud_case = FraudCase(
                transaction_id=tx.id,
                fraud_score=result["fraud_probability"],
                risk_level=result["risk_level"],
                status="OPEN",
            )
            db.add(fraud_case)
            db.commit()

        return FraudPredictResponse(
            fraud_probability=result["fraud_probability"],
            risk_level=result["risk_level"],
            transaction_id=tx.id,
        )
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/high-risk", response_model=List[FraudCaseResponse])
def get_high_risk(db: Session = Depends(get_db)):
    """Return all open fraud cases (high risk transactions)."""
    cases = (
        db.query(FraudCase)
        .filter(FraudCase.status != "RESOLVED")
        .order_by(FraudCase.created_at.desc())
        .limit(50)
        .all()
    )
    return cases
