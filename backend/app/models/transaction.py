from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, func
from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    bank_id = Column(String, index=True, nullable=False)
    account_id = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    merchant_category = Column(String, nullable=False)
    location = Column(String, nullable=False)
    is_fraud_label = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
