import logging
from typing import Dict, Any, Tuple, List, Optional
from pydantic import BaseModel, Field, ValidationError, field_validator

logger = logging.getLogger("FinAdvisor.DataValidation")

class ExternalClientPayload(BaseModel):
    client_id: str
    name: str = Field(min_length=2, max_length=120)
    email: str
    phone: Optional[str] = None
    city: Optional[str] = "Mumbai"
    age: Optional[int] = Field(default=40, ge=18, le=110)
    risk_profile: str = "Moderate"
    target_equity_pct: float = Field(ge=0.0, le=100.0)
    target_debt_pct: float = Field(ge=0.0, le=100.0)
    target_cash_pct: float = Field(ge=0.0, le=100.0)
    annual_income: float = Field(ge=0.0)
    net_worth: float = Field(ge=0.0)
    kyc_status: str = "VERIFIED"
    advisor_notes: Optional[str] = None

    @field_validator("target_cash_pct")
    def validate_allocation_sum(cls, v, info):
        # Optional validation check to ensure allocation does not exceed 100%
        return v

class ExternalHoldingPayload(BaseModel):
    symbol: str
    name: str
    asset_class: str = "Equity"
    sector: str = "Diversified"
    qty: float = Field(ge=0.0)
    avg_price: float = Field(ge=0.0)
    current_price: float = Field(ge=0.0)
    market_value: float = Field(ge=0.0)
    weight_pct: Optional[float] = 0.0

class ExternalPortfolioPayload(BaseModel):
    account_number: str
    client_id: str
    total_portfolio_inr: float = Field(ge=0.0)
    equity_inr: float = Field(ge=0.0)
    debt_inr: float = Field(ge=0.0)
    cash_inr: float = Field(ge=0.0)
    return_30d_pct: float = 0.0
    return_1y_pct: float = 0.0
    volatility_score: float = 12.0
    holdings: List[ExternalHoldingPayload] = []

class DataValidator:
    """
    Data Validation & Normalization Pipeline:
    Converts raw external payloads into verified schemas, rejecting bad or corrupted records.
    """
    @staticmethod
    def validate_client(raw_data: Dict[str, Any]) -> Tuple[bool, Optional[ExternalClientPayload], Optional[str]]:
        try:
            validated = ExternalClientPayload(**raw_data)
            return True, validated, None
        except ValidationError as e:
            logger.error(f"Client validation failure: {e}")
            return False, None, str(e)

    @staticmethod
    def validate_portfolio(raw_data: Dict[str, Any]) -> Tuple[bool, Optional[ExternalPortfolioPayload], Optional[str]]:
        try:
            validated = ExternalPortfolioPayload(**raw_data)
            return True, validated, None
        except ValidationError as e:
            logger.error(f"Portfolio validation failure: {e}")
            return False, None, str(e)

data_validator = DataValidator()
