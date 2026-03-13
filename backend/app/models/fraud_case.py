from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, func
from app.database import Base


class FraudCase(Base):
    __tablename__ = "fraud_cases"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer, ForeignKey("transactions.id"), nullable=False)
    fraud_score = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)  # LOW | MEDIUM | HIGH
    status = Column(String, default="OPEN")  # OPEN | INVESTIGATING | RESOLVED
    investigation_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
