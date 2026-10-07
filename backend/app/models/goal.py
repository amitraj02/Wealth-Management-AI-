from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class FinancialGoal(Base):
    __tablename__ = "financial_goals"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    goal_name = Column(String(100), nullable=False) # Retirement, Child Education, Wealth Creation, Real Estate
    target_amount = Column(Float, nullable=False) # INR
    current_amount = Column(Float, default=0.0)
    target_year = Column(Integer, nullable=False) # e.g. 2032
    priority = Column(String(20), default="High") # High, Medium, Low
    status = Column(String(20), default="IN_PROGRESS") # IN_PROGRESS, ACHIEVED, OFF_TRACK
    on_track = Column(Boolean, default=True)
    required_monthly_sip = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def progress_pct(self) -> float:
        return (self.current_amount / self.target_amount * 100) if self.target_amount > 0 else 0.0

    client = relationship("Client", back_populates="goals")
