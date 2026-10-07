from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import Dict, Any, List
from datetime import datetime

from backend.app.database import get_db
from backend.app.models.client import Client
from backend.app.models.portfolio import Portfolio
from backend.app.models.approval import PendingApproval
from backend.app.models.audit import AiAuditLog
from backend.app.connectors.market_dhan_api import dhan_market_connector
from backend.app.schemas.agent import PrepareMyDayResponse

router = APIRouter(prefix="/advisor", tags=["Advisor Dashboard & Prepare My Day"])

@router.get("/stats")
async def get_advisor_stats(db: AsyncSession = Depends(get_db)):
    """Summary KPI metrics for the Advisor Overview"""
    # Total Clients
    c_res = await db.execute(select(func.count(Client.id)))
    total_clients = c_res.scalar() or 0

    # Total AUM
    aum_res = await db.execute(select(func.sum(Portfolio.total_value)))
    total_aum_inr = aum_res.scalar() or 0.0
    total_aum_cr = round(total_aum_inr / 10000000.0, 2) # In Crores

    # Pending Approvals
    app_res = await db.execute(select(func.count(PendingApproval.id)).where(PendingApproval.status == "PENDING"))
    pending_approvals = app_res.scalar() or 0

    # Total AI Audited Events
    aud_res = await db.execute(select(func.count(AiAuditLog.id)))
    total_audits = aud_res.scalar() or 0

    # High priority alerts count
    clients_res = await db.execute(select(Client).options(selectinload(Client.portfolio), selectinload(Client.goals)))
    all_clients = clients_res.scalars().all()
    critical_alerts = 0
    for c in all_clients:
        if c.portfolio:
            drift = abs(c.portfolio.equity_pct - c.target_equity_pct)
            if drift >= 10.0:
                critical_alerts += 1

    return {
        "total_clients": total_clients,
        "total_aum_cr": total_aum_cr,
        "total_aum_inr": total_aum_inr,
        "active_alerts": critical_alerts + pending_approvals,
        "pending_approvals": pending_approvals,
        "total_ai_actions_logged": total_audits,
        "advisor_name": "Amit Raj",
        "last_updated": datetime.utcnow().isoformat()
    }

@router.get("/prepare-my-day", response_model=PrepareMyDayResponse)
async def prepare_my_day(db: AsyncSession = Depends(get_db)):
    """
    Killer Feature: Prepare My Day
    Scans entire client roster (100+ clients), identifies portfolio allocation deviations,
    large transactions, market events, and goal milestones to produce prioritized action queue.
    """
    clients_res = await db.execute(select(Client).options(
        selectinload(Client.portfolio),
        selectinload(Client.goals),
        selectinload(Client.pending_approvals)
    ))
    clients = clients_res.scalars().all()

    critical_clients = []
    review_clients = []
    stable_clients = []

    for c in clients:
        port = c.portfolio
        tot_val = port.total_value if port else 0.0
        eq_pct = port.equity_pct if port else 0.0
        drift = round(eq_pct - c.target_equity_pct, 1)
        pending_count = len([p for p in c.pending_approvals if p.status == "PENDING"])
        off_track_goals = [g for g in c.goals if not g.on_track]

        item = {
            "client_id": c.id,
            "client_code": c.client_code,
            "full_name": c.full_name,
            "portfolio_val_lakh": round(tot_val / 100000.0, 1),
            "equity_pct": round(eq_pct, 1),
            "target_equity_pct": c.target_equity_pct,
            "drift_pct": drift,
            "return_30d_pct": port.return_30d_pct if port else 0.0,
            "pending_approvals": pending_count
        }

        if abs(drift) >= 10.0 or pending_count > 0 or len(off_track_goals) > 0:
            if abs(drift) >= 10.0:
                item["issue"] = f"Equity exposure ({eq_pct:.1f}%) exceeds target ({c.target_equity_pct:.1f}%) by {drift:+0.1f}%"
                item["action_needed"] = "Review rebalancing proposal"
            elif pending_count > 0:
                item["issue"] = "Rebalancing / Communication action pending advisor approval"
                item["action_needed"] = "Approve or Reject in Governance Queue"
            else:
                item["issue"] = f"Goal '{off_track_goals[0].goal_name}' is falling behind schedule"
                item["action_needed"] = "Schedule SIP step-up meeting"
            critical_clients.append(item)
        elif abs(drift) >= 5.0 or (port and port.volatility_score > 18.0):
            item["issue"] = f"Moderate allocation drift ({drift:+0.1f}%)" if abs(drift) >= 5.0 else "Elevated 30-day volatility"
            item["action_needed"] = "Monitor in weekly review"
            review_clients.append(item)
        else:
            item["issue"] = "Portfolio fully aligned with mandate"
            item["action_needed"] = "No immediate action required"
            stable_clients.append(item)

    # Market Overview
    market_overview = await dhan_market_connector.get_market_indices()

    # AI Daily Briefing Synthesis
    today_str = datetime.utcnow().strftime("%A, %d %B %Y")
    ai_brief = f"""### 🌅 Good Morning, Advisor! Here is your daily priority briefing for {today_str}:

- **🔴 High Priority ({len(critical_clients)} clients)**: Require immediate review. Top focus is **Rajesh Kumar** (+13.0% equity drift) and **Neha Singh** (education goal milestone).
- **🟡 Watchlist ({len(review_clients)} clients)**: Moderate allocation drift or elevated volatility.
- **🟢 On Track ({len(stable_clients)} clients)**: Fully aligned with investment policy statements.

**Market Context**: NIFTY 50 opened at {market_overview['nifty_50']['current']} ({market_overview['nifty_50']['change_pct']:+0.2f}%). India VIX is low at {market_overview['india_vix']['current']}, favoring rebalancing execution today.
"""

    suggested_actions = [
        {"action_id": "ACT-1", "title": f"Review {len(critical_clients)} Priority Client Accounts", "type": "URGENT", "target": "Critical List"},
        {"action_id": "ACT-2", "title": "Authorize Pending Rebalancing Orders in Governance Queue", "type": "GOVERNANCE", "target": "Approvals"},
        {"action_id": "ACT-3", "title": "Generate Meeting Brief for 11:00 AM Client Review", "type": "MEETING", "target": "Rajesh Kumar"}
    ]

    return PrepareMyDayResponse(
        date=today_str,
        total_clients_scanned=len(clients),
        critical_count=len(critical_clients),
        review_count=len(review_clients),
        stable_count=len(stable_clients),
        critical_clients=critical_clients[:10], # Top 10 critical
        review_clients=review_clients[:10],
        stable_clients=stable_clients[:10],
        market_overview=market_overview,
        ai_advisor_briefing=ai_brief,
        suggested_actions=suggested_actions
    )
