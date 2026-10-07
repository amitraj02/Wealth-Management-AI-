from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ClientBase(BaseModel):
    client_code: str
    full_name: str
    email: str
    phone: Optional[str] = None
    city: Optional[str] = "Mumbai"
    age: Optional[int] = 42
    risk_profile: Optional[str] = "Moderate"
    target_equity_pct: float = 65.0
    target_debt_pct: float = 25.0
    target_cash_pct: float = 10.0
    annual_income: float = 3500000.0
    net_worth: float = 15000000.0
    kyc_status: str = "VERIFIED"
    tax_bracket: str = "30%"
    advisor_notes: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    risk_profile: Optional[str] = None
    target_equity_pct: Optional[float] = None
    target_debt_pct: Optional[float] = None
    target_cash_pct: Optional[float] = None
    advisor_notes: Optional[str] = None

class ClientResponse(ClientBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ClientSummaryResponse(BaseModel):
    id: int
    client_code: str
    full_name: str
    email: str
    city: str
    risk_profile: str
    total_portfolio_value: float
    equity_pct: float
    debt_pct: float
    cash_pct: float
    target_equity_pct: float
    equity_deviation: float
    return_30d_pct: float
    priority_flag: str # "CRITICAL", "REVIEW", "STABLE"
    priority_reason: Optional[str] = None
    pending_approvals_count: int = 0
    goals_count: int = 0
    kyc_status: str
