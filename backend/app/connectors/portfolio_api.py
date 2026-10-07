import random
from typing import Dict, List, Any, Optional
from datetime import datetime

class ExternalPortfolioAPI:
    """
    Simulates external Custodian / Clearing House / Depository APIs:
    GET /api/external/portfolio/{client_id}
    GET /api/external/transactions/{client_id}
    """
    def __init__(self):
        pass

    async def fetch_portfolio_by_code(self, client_code: str) -> Optional[Dict[str, Any]]:
        # Specific portfolio profiles reflecting realistic wealth management scenarios
        if client_code == "CL-101": # Rajesh Kumar (Tech heavy, Equity deviation 78% vs 65% target)
            return {
                "account_number": "CUST-IN-889021",
                "client_id": "CL-101",
                "total_portfolio_inr": 4820000.0,
                "equity_inr": 3759600.0, # 78%
                "debt_inr": 723000.0,    # 15%
                "cash_inr": 337400.0,    # 7%
                "return_30d_pct": 2.8,
                "return_1y_pct": 14.6,
                "volatility_score": 16.8,
                "holdings": [
                    {"symbol": "TCS", "name": "Tata Consultancy Services", "asset_class": "Equity", "sector": "Technology", "qty": 350, "avg_price": 3800.0, "current_price": 4210.0, "market_value": 1473500.0, "weight_pct": 30.57},
                    {"symbol": "INFY", "name": "Infosys Ltd", "asset_class": "Equity", "sector": "Technology", "qty": 650, "avg_price": 1620.0, "current_price": 1890.75, "market_value": 1228987.5, "weight_pct": 25.50},
                    {"symbol": "RELIANCE", "name": "Reliance Industries Ltd", "asset_class": "Equity", "sector": "Energy & Retail", "qty": 355, "avg_price": 2750.0, "current_price": 2980.50, "market_value": 1057112.5, "weight_pct": 21.93},
                    {"symbol": "HDFCDEBT", "name": "HDFC Corporate Bond Direct Growth", "asset_class": "Debt", "sector": "Fixed Income", "qty": 22700, "avg_price": 30.5, "current_price": 31.85, "market_value": 723000.0, "weight_pct": 15.00},
                    {"symbol": "LIQUIDBEES", "name": "Nippon India ETF Liquid BeES", "asset_class": "Cash", "sector": "Money Market", "qty": 337.4, "avg_price": 1000.0, "current_price": 1000.0, "market_value": 337400.0, "weight_pct": 7.00}
                ],
                "_source": "External Custody Portfolio API (NSDL/CDSL Feed)",
                "_fetched_at": datetime.utcnow().isoformat()
            }
        elif client_code == "CL-102": # Amit Raj (Aggressive, large recent ESOP & purchases)
            return {
                "account_number": "DHAN-1104228365",
                "client_id": "CL-102",
                "dhan_client_id": "1104228365",
                "broker": "Dhan",
                "total_portfolio_inr": 8200000.0,
                "equity_inr": 6724000.0, # 82%
                "debt_inr": 1148000.0,   # 14%
                "cash_inr": 328000.0,    # 4%
                "return_30d_pct": 6.4,
                "return_1y_pct": 22.1,
                "volatility_score": 19.5,
                "holdings": [
                    {"symbol": "BAJFINANCE", "name": "Bajaj Finance Ltd", "asset_class": "Equity", "sector": "NBFC", "qty": 450, "avg_price": 6400.0, "current_price": 7150.0, "market_value": 3217500.0, "weight_pct": 39.24},
                    {"symbol": "TATAMOTORS", "name": "Tata Motors Ltd", "asset_class": "Equity", "sector": "Automobile", "qty": 2100, "avg_price": 820.0, "current_price": 965.80, "market_value": 2028180.0, "weight_pct": 24.73},
                    {"symbol": "ICICIBANK", "name": "ICICI Bank Ltd", "asset_class": "Equity", "sector": "Banking & Financials", "qty": 1216, "avg_price": 1050.0, "current_price": 1215.40, "market_value": 1478320.0, "weight_pct": 18.03},
                    {"symbol": "HDFCDEBT", "name": "HDFC Corporate Bond Direct Growth", "asset_class": "Debt", "sector": "Fixed Income", "qty": 36044, "avg_price": 31.0, "current_price": 31.85, "market_value": 1148000.0, "weight_pct": 14.00},
                    {"symbol": "LIQUIDBEES", "name": "Nippon India ETF Liquid BeES", "asset_class": "Cash", "sector": "Money Market", "qty": 328, "avg_price": 1000.0, "current_price": 1000.0, "market_value": 328000.0, "weight_pct": 4.00}
                ],
                "_source": "External Custody Portfolio API",
                "_fetched_at": datetime.utcnow().isoformat()
            }
        elif client_code == "CL-103": # Neha Singh (Goal deviation, conservative, overseas education target)
            return {
                "account_number": "CUST-IN-773419",
                "client_id": "CL-103",
                "total_portfolio_inr": 9500000.0,
                "equity_inr": 3325000.0, # 35%
                "debt_inr": 4750000.0,   # 50%
                "cash_inr": 1425000.0,   # 15%
                "return_30d_pct": 0.9,
                "return_1y_pct": 7.8,
                "volatility_score": 7.2,
                "holdings": [
                    {"symbol": "ICICIGILT", "name": "ICICI Prudential Gilt Fund", "asset_class": "Debt", "sector": "Govt Securities", "qty": 35000, "avg_price": 91.0, "current_price": 94.20, "market_value": 3297000.0, "weight_pct": 34.70},
                    {"symbol": "HDFCDEBT", "name": "HDFC Corporate Bond Direct Growth", "asset_class": "Debt", "sector": "Fixed Income", "qty": 45620, "avg_price": 31.2, "current_price": 31.85, "market_value": 1453000.0, "weight_pct": 15.30},
                    {"symbol": "HDFCBANK", "name": "HDFC Bank Ltd", "asset_class": "Equity", "sector": "Banking & Financials", "qty": 1200, "avg_price": 1580.0, "current_price": 1645.20, "market_value": 1974240.0, "weight_pct": 20.78},
                    {"symbol": "HINDUNILVR", "name": "Hindustan Unilever Ltd", "asset_class": "Equity", "sector": "FMCG", "qty": 496, "avg_price": 2600.0, "current_price": 2720.00, "market_value": 1350760.0, "weight_pct": 14.22},
                    {"symbol": "LIQUIDBEES", "name": "Nippon India ETF Liquid BeES", "asset_class": "Cash", "sector": "Money Market", "qty": 1425, "avg_price": 1000.0, "current_price": 1000.0, "market_value": 1425000.0, "weight_pct": 15.00}
                ],
                "_source": "External Custody Portfolio API",
                "_fetched_at": datetime.utcnow().isoformat()
            }
        else:
            return {
                "account_number": f"CUST-IN-{random.randint(100000, 999999)}",
                "client_id": client_code,
                "total_portfolio_inr": 3500000.0,
                "equity_inr": 2100000.0,
                "debt_inr": 1050000.0,
                "cash_inr": 350000.0,
                "return_30d_pct": 1.9,
                "return_1y_pct": 11.2,
                "volatility_score": 11.5,
                "holdings": [
                    {"symbol": "NIFTY50", "name": "NIFTY 50 Index ETF", "asset_class": "Equity", "sector": "Index", "qty": 8300, "avg_price": 240.0, "current_price": 252.40, "market_value": 2094920.0, "weight_pct": 59.85},
                    {"symbol": "HDFCDEBT", "name": "HDFC Corporate Bond Direct Growth", "asset_class": "Debt", "sector": "Fixed Income", "qty": 32967, "avg_price": 31.0, "current_price": 31.85, "market_value": 1050000.0, "weight_pct": 30.00},
                    {"symbol": "LIQUIDBEES", "name": "Nippon India ETF Liquid BeES", "asset_class": "Cash", "sector": "Money Market", "qty": 355, "avg_price": 1000.0, "current_price": 1000.0, "market_value": 355080.0, "weight_pct": 10.15}
                ],
                "_source": "External Custody Portfolio API",
                "_fetched_at": datetime.utcnow().isoformat()
            }

external_portfolio_api = ExternalPortfolioAPI()
