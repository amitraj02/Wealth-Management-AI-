from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class PendingApproval(Base):
    __tablename__ = "pending_approvals"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False, index=True)
    action_type = Column(String(50), nullable=False) # e.g. "REBALANCE_PORTFOLIO", "CLIENT_EMAIL_DRAFT", "ALLOCATION_OVERRIDE", "FOLLOW_UP_TASK"
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    proposed_payload = Column(JSON, nullable=True) # Concrete JSON parameters proposed by AI
    ai_reasoning = Column(Text, nullable=True) # Why the AI recommended this
    policy_violation_reasons = Column(Text, nullable=True) # E.g. "Policy 1: AI cannot execute trades directly"
    urgency = Column(String(20), default="Medium") # High, Medium, Low
    status = Column(String(30), default="PENDING") # PENDING, APPROVED, REJECTED, MODIFIED
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    reviewed_at = Column(DateTime, nullable=True)
    reviewed_by = Column(String(50), nullable=True)
    advisor_notes = Column(Text, nullable=True)

    client = relationship("Client", back_populates="pending_approvals")
