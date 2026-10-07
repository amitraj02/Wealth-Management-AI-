import random
from typing import Dict, List, Any, Optional
from datetime import datetime

class ExternalClientAPI:
    """
    Simulates external Client CRM / Core Banking API endpoints:
    GET /api/external/client/{id}
    GET /api/external/clients
    """
    def __init__(self):
        self._mock_clients = [
            {
                "client_id": "CL-101",
                "name": "Rajesh Kumar",
                "email": "rajesh.kumar@gmail.com",
                "phone": "+91 98201 44521",
                "city": "Mumbai",
                "age": 46,
                "risk_profile": "Moderate",
                "target_equity_pct": 65.0,
                "target_debt_pct": 25.0,
                "target_cash_pct": 10.0,
                "annual_income": 6500000.0,
                "net_worth": 38000000.0,
                "kyc_status": "VERIFIED",
                "tax_bracket": "30%",
                "advisor_notes": "Senior VP at IT Multinational. Planning retirement at 55. Prefers bluechip equities with steady debt allocations."
            },
            {
                "client_id": "CL-102",
                "name": "Amit Raj",
                "email": "amit.raj@outlook.com",
                "phone": "+91 97112 88410",
                "city": "Bengaluru",
                "age": 34,
                "risk_profile": "Aggressive",
                "target_equity_pct": 80.0,
                "target_debt_pct": 15.0,
                "target_cash_pct": 5.0,
                "annual_income": 4800000.0,
                "net_worth": 22000000.0,
                "kyc_status": "VERIFIED",
                "tax_bracket": "30%",
                "dhan_client_id": "1104228365",
                "broker": "Dhan (Client ID: 1104228365)",
                "advisor_notes": "Tech Founder. High risk tolerance. Integrated via Dhan Broker (Client ID: 1104228365). Recently liquidated ESOPs; look for capital gain tax minimization."
            },
            {
                "client_id": "CL-103",
                "name": "Neha Singh",
                "email": "neha.singh@yahoo.com",
                "phone": "+91 99304 12789",
                "city": "Delhi NCR",
                "age": 52,
                "risk_profile": "Conservative",
                "target_equity_pct": 40.0,
                "target_debt_pct": 45.0,
                "target_cash_pct": 15.0,
                "annual_income": 3200000.0,
                "net_worth": 45000000.0,
                "kyc_status": "VERIFIED",
                "tax_bracket": "30%",
                "advisor_notes": "Doctor. Priority is daughter's overseas medical education in 2027 and capital preservation."
            },
            {
                "client_id": "CL-104",
                "name": "Priya Mehta",
                "email": "priya.mehta@finvest.in",
                "phone": "+91 98450 77123",
                "city": "Pune",
                "age": 39,
                "risk_profile": "Moderate",
                "target_equity_pct": 60.0,
                "target_debt_pct": 30.0,
                "target_cash_pct": 10.0,
                "annual_income": 4200000.0,
                "net_worth": 18500000.0,
                "kyc_status": "VERIFIED",
                "tax_bracket": "30%",
                "advisor_notes": "Management Consultant. Regular monthly SIP investor. Interested in Gold ETF diversification."
            },
            {
                "client_id": "CL-105",
                "name": "Vikram Malhotra",
                "email": "vikram.malhotra@indocorp.com",
                "phone": "+91 98190 66234",
                "city": "Mumbai",
                "age": 58,
                "risk_profile": "Conservative",
                "target_equity_pct": 35.0,
                "target_debt_pct": 50.0,
                "target_cash_pct": 15.0,
                "annual_income": 8500000.0,
                "net_worth": 92000000.0,
                "kyc_status": "VERIFIED",
                "tax_bracket": "30%",
                "advisor_notes": "High Net Worth business owner. Estate planning and family trust creation initiated."
            }
        ]

    async def fetch_client_by_code(self, client_code: str) -> Optional[Dict[str, Any]]:
        for c in self._mock_clients:
            if c["client_id"] == client_code or c["name"].lower() == client_code.lower():
                return {**c, "_source": "External Client CRM API", "_fetched_at": datetime.utcnow().isoformat()}
        return None

    async def fetch_all_clients(self) -> List[Dict[str, Any]]:
        return [{**c, "_source": "External Client CRM API", "_fetched_at": datetime.utcnow().isoformat()} for c in self._mock_clients]

external_client_api = ExternalClientAPI()
