from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), unique=True, nullable=False)
    account_number = Column(String(50), unique=True, nullable=False)
    total_value = Column(Float, default=0.0) # INR
    equity_value = Column(Float, default=0.0)
    debt_value = Column(Float, default=0.0)
    cash_value = Column(Float, default=0.0)
    realized_pnl = Column(Float, default=0.0)
    unrealized_pnl = Column(Float, default=0.0)
    return_30d_pct = Column(Float, default=0.0)
    return_1y_pct = Column(Float, default=0.0)
    volatility_score = Column(Float, default=12.5) # Annualized Volatility %
    sharpe_ratio = Column(Float, default=1.65)
    last_rebalanced_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Computed Asset allocation percentages
    @property
    def equity_pct(self) -> float:
        return (self.equity_value / self.total_value * 100) if self.total_value > 0 else 0.0

    @property
    def debt_pct(self) -> float:
        return (self.debt_value / self.total_value * 100) if self.total_value > 0 else 0.0

    @property
    def cash_pct(self) -> float:
        return (self.cash_value / self.total_value * 100) if self.total_value > 0 else 0.0

    # Relationships
    client = relationship("Client", back_populates="portfolio")
    holdings = relationship("Holding", back_populates="portfolio", cascade="all, delete-orphan")


class Holding(Base):
    __tablename__ = "holdings"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    symbol = Column(String(30), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    asset_class = Column(String(30), default="Equity") # Equity, Debt, Cash, Gold/Commodity
    sector = Column(String(50), default="Technology") # Technology, Banking, Healthcare, Energy, etc.
    quantity = Column(Float, nullable=False)
    avg_buy_price = Column(Float, nullable=False)
    current_price = Column(Float, nullable=False)
    market_value = Column(Float, nullable=False)
    unrealized_pnl = Column(Float, default=0.0)
    unrealized_pnl_pct = Column(Float, default=0.0)
    weight_pct = Column(Float, default=0.0) # Allocation weight in portfolio
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    portfolio = relationship("Portfolio", back_populates="holdings")
