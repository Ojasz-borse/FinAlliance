from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FraudPredictRequest(BaseModel):
    bank_id: str
    amount: float
    merchant_category: str
    location: str
    timestamp: str


class FraudPredictResponse(BaseModel):
    fraud_probability: float
    risk_level: str  # LOW | MEDIUM | HIGH
    transaction_id: Optional[int] = None


class FraudCaseResponse(BaseModel):
    id: int
    transaction_id: int
    fraud_score: float
    risk_level: str
    status: str
    investigation_notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
