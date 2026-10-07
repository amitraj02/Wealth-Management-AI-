from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class AiAuditLog(Base):
    __tablename__ = "ai_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    user_id = Column(String(50), default="advisor_main", index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True, index=True)
    agent_name = Column(String(50), default="FinAdvisor Core Agent")
    action = Column(String(100), nullable=False) # e.g. "GENERATE_MEETING_BRIEF", "PORTFOLIO_ANALYSIS", "REBALANCE_RECOMMENDATION"
    tool_used = Column(String(100), nullable=True) # e.g. "calculate_asset_allocation", "get_market_price"
    input_params = Column(JSON, nullable=True)
    output_summary = Column(Text, nullable=True)
    policy_result = Column(String(30), default="PASSED") # PASSED, FLAGGED, BLOCKED, REQUIRES_APPROVAL
    policy_details = Column(Text, nullable=True)
    human_approval_status = Column(String(30), default="NOT_REQUIRED") # NOT_REQUIRED, PENDING, APPROVED, REJECTED
    human_reviewer_id = Column(String(50), nullable=True)
    review_notes = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    client = relationship("Client", back_populates="audit_logs")
