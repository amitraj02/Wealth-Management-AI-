from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from backend.app.database import Base

class MarketTicker(Base):
    __tablename__ = "market_tickers"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(30), unique=True, index=True, nullable=False) # RELIANCE, TCS, HDFCBANK, INFY, etc.
    name = Column(String(100), nullable=False)
    exchange = Column(String(20), default="NSE")
    asset_class = Column(String(30), default="Equity") # Equity, Index, Debt, Commodity
    sector = Column(String(50), default="Diversified")
    current_price = Column(Float, nullable=False)
    change_pct = Column(Float, default=0.0)
    day_high = Column(Float, nullable=False)
    day_low = Column(Float, nullable=False)
    high_52w = Column(Float, nullable=False)
    low_52w = Column(Float, nullable=False)
    pe_ratio = Column(Float, default=22.5)
    market_cap_cr = Column(Float, default=100000.0)
    dhan_security_id = Column(String(50), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
