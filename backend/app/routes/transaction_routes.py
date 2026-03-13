from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.transaction import Transaction
from app.schemas.transaction_schema import TransactionCreate, TransactionResponse

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/add", response_model=TransactionResponse)
def add_transaction(payload: TransactionCreate, db: Session = Depends(get_db)):
    """Add a new transaction to the database."""
    tx = Transaction(
        bank_id=payload.bank_id,
        account_id=payload.account_id,
        amount=payload.amount,
        timestamp=payload.timestamp,
        merchant_category=payload.merchant_category,
        location=payload.location,
        is_fraud_label=payload.is_fraud_label or False,
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx


@router.get("/all", response_model=List[TransactionResponse])
def get_all_transactions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Retrieve all transactions with optional pagination."""
    transactions = (
        db.query(Transaction)
        .order_by(Transaction.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return transactions


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    """Get a single transaction by ID."""
    tx = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return tx
