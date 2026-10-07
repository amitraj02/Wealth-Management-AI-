from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from backend.app.models.client import Client
from backend.app.models.portfolio import Portfolio, Holding
from backend.app.models.transaction import Transaction
from backend.app.models.goal import FinancialGoal
from backend.app.connectors.market_dhan_api import dhan_market_connector

class FinancialToolsRegistry:
    """
    Model Context Protocol (MCP) Financial Tools
    Exposes deterministic, verified financial data and analytical calculations for the AI Agent.
    """

    @staticmethod
    async def get_client_profile(db: AsyncSession, client_id: int) -> Dict[str, Any]:
        """Fetch complete client profile, risk tolerance, and financial parameters"""
        query = select(Client).where(Client.id == client_id).options(selectinload(Client.goals))
        result = await db.execute(query)
        client = result.scalar_one_or_none()
        if not client:
            return {"error": f"Client ID {client_id} not found in database"}

        return {
            "client_id": client.id,
            "client_code": client.client_code,
            "full_name": client.full_name,
            "email": client.email,
            "city": client.city,
            "age": client.age,
            "risk_profile": client.risk_profile,
            "target_equity_pct": client.target_equity_pct,
            "target_debt_pct": client.target_debt_pct,
            "target_cash_pct": client.target_cash_pct,
            "annual_income_inr": client.annual_income,
            "net_worth_inr": client.net_worth,
            "kyc_status": client.kyc_status,
            "advisor_notes": client.advisor_notes,
            "goals": [
                {
                    "name": g.goal_name,
                    "target_inr": g.target_amount,
                    "current_inr": g.current_amount,
                    "target_year": g.target_year,
                    "progress_pct": round(g.progress_pct, 1),
                    "on_track": g.on_track
                } for g in client.goals
            ]
        }

    @staticmethod
    async def get_portfolio(db: AsyncSession, client_id: int) -> Dict[str, Any]:
        """Fetch real-time portfolio holdings, valuations, asset allocations and weights"""
        query = select(Portfolio).where(Portfolio.client_id == client_id).options(selectinload(Portfolio.holdings))
        result = await db.execute(query)
        portfolio = result.scalar_one_or_none()
        if not portfolio:
            return {"error": f"Portfolio for client ID {client_id} not found"}

        holdings_list = []
        for h in portfolio.holdings:
            holdings_list.append({
                "symbol": h.symbol,
                "name": h.name,
                "asset_class": h.asset_class,
                "sector": h.sector,
                "quantity": h.quantity,
                "avg_buy_price": h.avg_buy_price,
                "current_price": h.current_price,
                "market_value_inr": round(h.market_value, 2),
                "unrealized_pnl_pct": round(h.unrealized_pnl_pct, 2),
                "weight_pct": round(h.weight_pct, 2)
            })

        return {
            "portfolio_id": portfolio.id,
            "account_number": portfolio.account_number,
            "total_value_inr": portfolio.total_value,
            "equity_value_inr": portfolio.equity_value,
            "debt_value_inr": portfolio.debt_value,
            "cash_value_inr": portfolio.cash_value,
            "equity_pct": round(portfolio.equity_pct, 2),
            "debt_pct": round(portfolio.debt_pct, 2),
            "cash_pct": round(portfolio.cash_pct, 2),
            "return_30d_pct": portfolio.return_30d_pct,
            "return_1y_pct": portfolio.return_1y_pct,
            "volatility_score": portfolio.volatility_score,
            "sharpe_ratio": portfolio.sharpe_ratio,
            "holdings_count": len(holdings_list),
            "holdings": holdings_list
        }

    @staticmethod
    async def get_transactions(db: AsyncSession, client_id: int, limit: int = 10) -> Dict[str, Any]:
        """Fetch recent transactions and settlement history"""
        query = select(Transaction).where(Transaction.client_id == client_id).order_by(Transaction.timestamp.desc()).limit(limit)
        result = await db.execute(query)
        txns = result.scalars().all()
        return {
            "client_id": client_id,
            "transactions_count": len(txns),
            "transactions": [
                {
                    "txn_ref": t.txn_ref,
                    "symbol": t.symbol,
                    "type": t.txn_type,
                    "qty": t.quantity,
                    "price": t.price,
                    "amount_inr": t.total_amount,
                    "status": t.status,
                    "notes": t.notes,
                    "date": t.timestamp.strftime("%Y-%m-%d %H:%M")
                } for t in txns
            ]
        }

    @staticmethod
    async def get_market_data(symbol: str) -> Dict[str, Any]:
        """Query live / simulated quotes via Dhan Market API"""
        return await dhan_market_connector.get_market_quote(symbol)

    @staticmethod
    async def calculate_asset_allocation(db: AsyncSession, client_id: int) -> Dict[str, Any]:
        """Analyze asset allocation drift vs client target risk profile"""
        client_res = await db.execute(select(Client).where(Client.id == client_id))
        client = client_res.scalar_one_or_none()
        if not client:
            return {"error": "Client not found"}

        port_res = await db.execute(select(Portfolio).where(Portfolio.client_id == client_id).options(selectinload(Portfolio.holdings)))
        port = port_res.scalar_one_or_none()
        if not port:
            return {"error": "Portfolio not found"}

        current_equity = port.equity_pct
        current_debt = port.debt_pct
        current_cash = port.cash_pct

        equity_drift = round(current_equity - client.target_equity_pct, 2)
        debt_drift = round(current_debt - client.target_debt_pct, 2)
        cash_drift = round(current_cash - client.target_cash_pct, 2)

        is_drift_significant = abs(equity_drift) > 5.0 or abs(debt_drift) > 5.0
        
        # Identify top concentrated sectors and stocks
        sector_weights = {}
        for h in port.holdings:
            sector_weights[h.sector] = sector_weights.get(h.sector, 0.0) + h.weight_pct

        top_sector = max(sector_weights.items(), key=lambda x: x[1]) if sector_weights else ("None", 0)

        return {
            "client_name": client.full_name,
            "target_allocation": {"equity": client.target_equity_pct, "debt": client.target_debt_pct, "cash": client.target_cash_pct},
            "current_allocation": {"equity": current_equity, "debt": current_debt, "cash": current_cash},
            "drift": {"equity_drift_pct": equity_drift, "debt_drift_pct": debt_drift, "cash_drift_pct": cash_drift},
            "is_drift_significant": is_drift_significant,
            "top_concentrated_sector": {"sector": top_sector[0], "weight_pct": round(top_sector[1], 2)},
            "recommendation_required": is_drift_significant
        }

    @staticmethod
    async def calculate_portfolio_returns(db: AsyncSession, client_id: int) -> Dict[str, Any]:
        """Compute portfolio performance, Sharpe ratio, and annualized volatility"""
        port_res = await db.execute(select(Portfolio).where(Portfolio.client_id == client_id))
        port = port_res.scalar_one_or_none()
        if not port:
            return {"error": "Portfolio not found"}

        return {
            "client_id": client_id,
            "total_value_inr": port.total_value,
            "return_30d_pct": port.return_30d_pct,
            "return_1y_pct": port.return_1y_pct,
            "realized_pnl_inr": port.realized_pnl,
            "unrealized_pnl_inr": port.unrealized_pnl,
            "volatility_score": port.volatility_score,
            "sharpe_ratio": port.sharpe_ratio,
            "performance_status": "OUTPERFORMING" if port.return_1y_pct > 12.0 else "BENCHMARK_ALIGNED"
        }

    @staticmethod
    async def search_client_documents(db: AsyncSession, client_id: int, query: str) -> Dict[str, Any]:
        """Simulate RAG search across client investment policy statements, KYC forms and notes"""
        client_res = await db.execute(select(Client).where(Client.id == client_id))
        client = client_res.scalar_one_or_none()
        if not client:
            return {"error": "Client not found"}

        snippets = [
            f"Investment Policy Statement (IPS 2026): Client {client.full_name} has mandated a max equity ceiling of {client.target_equity_pct + 5}%.",
            f"Tax Strategy: Annual tax liability bracket {client.tax_bracket}. Advise on long term capital gains harvest.",
            f"Advisor CRM Note: {client.advisor_notes or 'Standard wealth management mandate.'}"
        ]
        return {
            "client_id": client_id,
            "query": query,
            "document_matches": snippets,
            "source": "FinAdvisor Document Vault"
        }

mcp_tools = FinancialToolsRegistry()
