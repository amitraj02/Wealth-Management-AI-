from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from sqlalchemy.orm import selectinload
from typing import List, Optional

from backend.app.database import get_db
from backend.app.models.client import Client
from backend.app.models.portfolio import Portfolio, Holding
from backend.app.models.goal import FinancialGoal
from backend.app.models.approval import PendingApproval
from backend.app.schemas.client import ClientResponse, ClientSummaryResponse, ClientCreate, ClientUpdate

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.get("", response_model=List[ClientSummaryResponse])
async def list_clients(
    search: Optional[str] = None,
    risk_profile: Optional[str] = None,
    priority: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    query = select(Client).options(
        selectinload(Client.portfolio),
        selectinload(Client.goals),
        selectinload(Client.pending_approvals)
    )

    if search:
        query = query.where(Client.full_name.ilike(f"%{search}%") | Client.client_code.ilike(f"%{search}%") | Client.email.ilike(f"%{search}%"))
    if risk_profile:
        query = query.where(Client.risk_profile == risk_profile)

    result = await db.execute(query.offset(skip).limit(limit))
    clients = result.scalars().all()

    summaries = []
    for c in clients:
        port = c.portfolio
        tot_val = port.total_value if port else 0.0
        eq_pct = port.equity_pct if port else 0.0
        debt_pct = port.debt_pct if port else 0.0
        cash_pct = port.cash_pct if port else 0.0
        drift = round(eq_pct - c.target_equity_pct, 1)

        # Priority calculation
        pending_count = len([p for p in c.pending_approvals if p.status == "PENDING"])
        off_track_goals = len([g for g in c.goals if not g.on_track])

        if abs(drift) >= 10.0 or pending_count > 0 or off_track_goals > 0:
            flag = "CRITICAL"
            reason = f"Equity drift of {drift:+0.1f}%" if abs(drift) >= 10.0 else ("Pending approval action" if pending_count > 0 else "Goal milestone off-track")
        elif abs(drift) >= 5.0 or (port and port.volatility_score > 18.0):
            flag = "REVIEW"
            reason = f"Moderate allocation drift ({drift:+0.1f}%)" if abs(drift) >= 5.0 else "High portfolio volatility"
        else:
            flag = "STABLE"
            reason = "Portfolio aligned with mandate"

        if priority and flag != priority.upper():
            continue

        summaries.append(ClientSummaryResponse(
            id=c.id,
            client_code=c.client_code,
            full_name=c.full_name,
            email=c.email,
            city=c.city,
            risk_profile=c.risk_profile,
            total_portfolio_value=tot_val,
            equity_pct=round(eq_pct, 1),
            debt_pct=round(debt_pct, 1),
            cash_pct=round(cash_pct, 1),
            target_equity_pct=c.target_equity_pct,
            equity_deviation=drift,
            return_30d_pct=port.return_30d_pct if port else 0.0,
            priority_flag=flag,
            priority_reason=reason,
            pending_approvals_count=pending_count,
            goals_count=len(c.goals),
            kyc_status=c.kyc_status
        ))

    return summaries

@router.get("/{client_id}")
async def get_client_360(client_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Client).where(Client.id == client_id).options(
        selectinload(Client.portfolio).selectinload(Portfolio.holdings),
        selectinload(Client.goals),
        selectinload(Client.transactions),
        selectinload(Client.pending_approvals),
        selectinload(Client.audit_logs)
    )
    result = await db.execute(query)
    client = result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    port = client.portfolio
    return {
        "client": {
            "id": client.id,
            "client_code": client.client_code,
            "full_name": client.full_name,
            "email": client.email,
            "phone": client.phone,
            "city": client.city,
            "age": client.age,
            "risk_profile": client.risk_profile,
            "target_equity_pct": client.target_equity_pct,
            "target_debt_pct": client.target_debt_pct,
            "target_cash_pct": client.target_cash_pct,
            "annual_income": client.annual_income,
            "net_worth": client.net_worth,
            "kyc_status": client.kyc_status,
            "tax_bracket": client.tax_bracket,
            "advisor_notes": client.advisor_notes,
            "created_at": client.created_at
        },
        "portfolio": {
            "id": port.id if port else None,
            "account_number": port.account_number if port else "N/A",
            "total_value": port.total_value if port else 0.0,
            "equity_value": port.equity_value if port else 0.0,
            "debt_value": port.debt_value if port else 0.0,
            "cash_value": port.cash_value if port else 0.0,
            "equity_pct": round(port.equity_pct, 1) if port else 0.0,
            "debt_pct": round(port.debt_pct, 1) if port else 0.0,
            "cash_pct": round(port.cash_pct, 1) if port else 0.0,
            "realized_pnl": port.realized_pnl if port else 0.0,
            "unrealized_pnl": port.unrealized_pnl if port else 0.0,
            "return_30d_pct": port.return_30d_pct if port else 0.0,
            "return_1y_pct": port.return_1y_pct if port else 0.0,
            "volatility_score": port.volatility_score if port else 0.0,
            "sharpe_ratio": port.sharpe_ratio if port else 0.0,
            "holdings": [
                {
                    "id": h.id,
                    "symbol": h.symbol,
                    "name": h.name,
                    "asset_class": h.asset_class,
                    "sector": h.sector,
                    "quantity": h.quantity,
                    "avg_buy_price": h.avg_buy_price,
                    "current_price": h.current_price,
                    "market_value": h.market_value,
                    "unrealized_pnl": h.unrealized_pnl,
                    "unrealized_pnl_pct": h.unrealized_pnl_pct,
                    "weight_pct": h.weight_pct
                } for h in (port.holdings if port else [])
            ]
        },
        "goals": [
            {
                "id": g.id,
                "goal_name": g.goal_name,
                "target_amount": g.target_amount,
                "current_amount": g.current_amount,
                "target_year": g.target_year,
                "priority": g.priority,
                "status": g.status,
                "on_track": g.on_track,
                "progress_pct": round(g.progress_pct, 1),
                "required_monthly_sip": g.required_monthly_sip
            } for g in client.goals
        ],
        "recent_transactions": [
            {
                "id": t.id,
                "txn_ref": t.txn_ref,
                "symbol": t.symbol,
                "asset_class": t.asset_class,
                "txn_type": t.txn_type,
                "quantity": t.quantity,
                "price": t.price,
                "total_amount": t.total_amount,
                "status": t.status,
                "notes": t.notes,
                "timestamp": t.timestamp
            } for t in sorted(client.transactions, key=lambda x: x.timestamp, reverse=True)[:10]
        ],
        "pending_approvals": [
            {
                "id": a.id,
                "action_type": a.action_type,
                "title": a.title,
                "description": a.description,
                "urgency": a.urgency,
                "status": a.status,
                "created_at": a.created_at
            } for a in client.pending_approvals if a.status == "PENDING"
        ]
    }
