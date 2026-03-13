from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TransactionCreate(BaseModel):
    bank_id: str
    account_id: Optional[str] = None
    amount: float
    timestamp: datetime
    merchant_category: str
    location: str
    is_fraud_label: Optional[bool] = False


class TransactionResponse(BaseModel):
    id: int
    bank_id: str
    account_id: Optional[str] = None
    amount: float
    timestamp: datetime
    merchant_category: str
    location: str
    is_fraud_label: bool
    fraud_score: Optional[float] = None
    status: Optional[str] = None

    class Config:
        from_attributes = True
