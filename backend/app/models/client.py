from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    client_code = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    city = Column(String(50), default="Mumbai")
    age = Column(Integer, default=42)
    risk_profile = Column(String(30), default="Moderate") # Conservative, Moderate, Aggressive, Very Aggressive
    target_equity_pct = Column(Float, default=65.0)
    target_debt_pct = Column(Float, default=25.0)
    target_cash_pct = Column(Float, default=10.0)
    annual_income = Column(Float, default=3500000.0) # INR
    net_worth = Column(Float, default=15000000.0) # INR
    kyc_status = Column(String(20), default="VERIFIED") # VERIFIED, PENDING, REJECTED
    tax_bracket = Column(String(20), default="30%")
    advisor_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    portfolio = relationship("Portfolio", back_populates="client", uselist=False, cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="client", cascade="all, delete-orphan")
    goals = relationship("FinancialGoal", back_populates="client", cascade="all, delete-orphan")
    audit_logs = relationship("AiAuditLog", back_populates="client")
    pending_approvals = relationship("PendingApproval", back_populates="client")
