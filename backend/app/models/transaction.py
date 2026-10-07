from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    txn_ref = Column(String(50), unique=True, index=True, nullable=False)
    symbol = Column(String(30), nullable=False, index=True)
    asset_class = Column(String(30), default="Equity")
    txn_type = Column(String(20), nullable=False) # BUY, SELL, DIVIDEND, DEPOSIT, WITHDRAWAL
    quantity = Column(Float, default=0.0)
    price = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False) # INR
    fees = Column(Float, default=0.0)
    status = Column(String(20), default="EXECUTED") # EXECUTED, SETTLED, CANCELLED
    notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    client = relationship("Client", back_populates="transactions")
