from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class HoldingSchema(BaseModel):
    id: int
    portfolio_id: int
    symbol: str
    name: str
    asset_class: str
    sector: str
    quantity: float
    avg_buy_price: float
    current_price: float
    market_value: float
    unrealized_pnl: float
    unrealized_pnl_pct: float
    weight_pct: float

    class Config:
        from_attributes = True

class PortfolioResponse(BaseModel):
    id: int
    client_id: int
    account_number: str
    total_value: float
    equity_value: float
    debt_value: float
    cash_value: float
    equity_pct: float
    debt_pct: float
    cash_pct: float
    realized_pnl: float
    unrealized_pnl: float
    return_30d_pct: float
    return_1y_pct: float
    volatility_score: float
    sharpe_ratio: float
    last_rebalanced_at: datetime
    holdings: List[HoldingSchema] = []

    class Config:
        from_attributes = True

class TransactionSchema(BaseModel):
    id: int
    client_id: int
    txn_ref: str
    symbol: str
    asset_class: str
    txn_type: str
    quantity: float
    price: float
    total_amount: float
    fees: float
    status: str
    notes: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class GoalSchema(BaseModel):
    id: int
    client_id: int
    goal_name: str
    target_amount: float
    current_amount: float
    target_year: int
    priority: str
    status: str
    on_track: bool
    progress_pct: float
    required_monthly_sip: float

    class Config:
        from_attributes = True

class MarketTickerSchema(BaseModel):
    id: int
    symbol: str
    name: str
    exchange: str
    asset_class: str
    sector: str
    current_price: float
    change_pct: float
    day_high: float
    day_low: float
    high_52w: float
    low_52w: float
    pe_ratio: float
    market_cap_cr: float
    updated_at: datetime

    class Config:
        from_attributes = True
