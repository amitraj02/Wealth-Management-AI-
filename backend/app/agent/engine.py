import time
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.client import Client
from backend.app.mcp.tools import mcp_tools
from backend.app.governance.policy_engine import policy_engine
from backend.app.governance.audit_logger import audit_logger
from backend.app.schemas.agent import AgentChatResponse, ToolExecutionStep
from backend.app.agent.prompts import MEETING_BRIEF_TEMPLATE

logger = logging.getLogger("FinAdvisor.AgentEngine")

class GovernedAgentEngine:
    """
    Governed Agentic AI Engine
    - Determines tool execution plan
    - Executes tools with latency & payload monitoring
    - Applies policy engine guardrails before proposing any consequential action
    - Logs all steps to immutable audit trail
    - Generates executive meeting briefs and rebalancing proposals
    """

    async def run_governed_query(
        self,
        db: AsyncSession,
        query: str,
        client_id: Optional[int] = None,
        user_id: str = "Advisor_Amit_Raj",
        enforce_governance: bool = True
    ) -> AgentChatResponse:
        start_time = time.time()
        tool_steps: List[ToolExecutionStep] = []
        sources: List[str] = ["Unified PostgreSQL", "Dhan Market API"]
        policy_checks: List[Dict[str, Any]] = []
        
        # 1. Resolve client if not provided by ID but mentioned by name in query
        if not client_id:
            all_clients = (await db.execute(select(Client))).scalars().all()
            for c in all_clients:
                if c.full_name.lower() in query.lower() or c.client_code.lower() in query.lower():
                    client_id = c.id
                    break
            if not client_id and all_clients:
                client_id = all_clients[0].id # default to first client for demonstration

        # 2. Plan and execute tools based on query intent
        client_data = None
        portfolio_data = None
        txns_data = None
        allocation_data = None
        returns_data = None

        step_counter = 1

        # Step 1: get_client_profile
        t0 = time.time()
        client_data = await mcp_tools.get_client_profile(db, client_id)
        tool_steps.append(ToolExecutionStep(
            step_num=step_counter,
            tool_name="get_client_profile",
            tool_input={"client_id": client_id},
            tool_output={"name": client_data.get("full_name"), "risk_profile": client_data.get("risk_profile"), "target_equity": client_data.get("target_equity_pct")},
            latency_ms=round((time.time() - t0) * 1000, 1),
            status="SUCCESS"
        ))
        step_counter += 1

        # Step 2: get_portfolio
        t0 = time.time()
        portfolio_data = await mcp_tools.get_portfolio(db, client_id)
        tool_steps.append(ToolExecutionStep(
            step_num=step_counter,
            tool_name="get_portfolio",
            tool_input={"client_id": client_id},
            tool_output={"total_value_inr": portfolio_data.get("total_value_inr"), "holdings_count": portfolio_data.get("holdings_count")},
            latency_ms=round((time.time() - t0) * 1000, 1),
            status="SUCCESS"
        ))
        step_counter += 1

        # Step 3: calculate_asset_allocation
        t0 = time.time()
        allocation_data = await mcp_tools.calculate_asset_allocation(db, client_id)
        tool_steps.append(ToolExecutionStep(
            step_num=step_counter,
            tool_name="calculate_asset_allocation",
            tool_input={"client_id": client_id},
            tool_output=allocation_data,
            latency_ms=round((time.time() - t0) * 1000, 1),
            status="SUCCESS"
        ))
        step_counter += 1

        # Step 4: calculate_portfolio_returns
        t0 = time.time()
        returns_data = await mcp_tools.calculate_portfolio_returns(db, client_id)
        tool_steps.append(ToolExecutionStep(
            step_num=step_counter,
            tool_name="calculate_portfolio_returns",
            tool_input={"client_id": client_id},
            tool_output=returns_data,
            latency_ms=round((time.time() - t0) * 1000, 1),
            status="SUCCESS"
        ))
        step_counter += 1

        # If query asks about trades or transactions, execute get_transactions
        if any(w in query.lower() for w in ["trade", "transaction", "buy", "sell", "activity", "recent"]):
            t0 = time.time()
            txns_data = await mcp_tools.get_transactions(db, client_id, limit=5)
            tool_steps.append(ToolExecutionStep(
                step_num=step_counter,
                tool_name="get_transactions",
                tool_input={"client_id": client_id, "limit": 5},
                tool_output=txns_data,
                latency_ms=round((time.time() - t0) * 1000, 1),
                status="SUCCESS"
            ))
            step_counter += 1
            sources.append("Transaction Clearing DB")

        # Step 5: Market quotes check for top holding
        top_holding = portfolio_data.get("holdings", [{}])[0].get("symbol", "RELIANCE")
        t0 = time.time()
        market_quote = await mcp_tools.get_market_data(top_holding)
        tool_steps.append(ToolExecutionStep(
            step_num=step_counter,
            tool_name="get_market_data",
            tool_input={"symbol": top_holding},
            tool_output={"symbol": market_quote.get("symbol"), "current_price": market_quote.get("current_price"), "change_pct": market_quote.get("change_pct")},
            latency_ms=round((time.time() - t0) * 1000, 1),
            status="SUCCESS"
        ))
        step_counter += 1

        # 3. Formulate synthesized analysis
        client_name = client_data.get("full_name", "Client")
        tot_val = portfolio_data.get("total_value_inr", 0)
        tot_val_lakh = round(tot_val / 100000.0, 2)
        eq_pct = portfolio_data.get("equity_pct", 0)
        target_eq = client_data.get("target_equity_pct", 65)
        debt_pct = portfolio_data.get("debt_pct", 0)
        cash_pct = portfolio_data.get("cash_pct", 0)
        drift = round(eq_pct - target_eq, 1)

        is_rebalance_needed = abs(drift) >= 5.0

        # Construct Meeting Brief
        obs_items = []
        if drift > 5.0:
            obs_items.append(f"⚠️ **Equity Overweight**: Actual equity is {eq_pct}% vs target of {target_eq}% (+{drift}% drift). Driven by strong rally in technology and growth holdings.")
        elif drift < -5.0:
            obs_items.append(f"⚠️ **Equity Underweight**: Actual equity is {eq_pct}% vs target of {target_eq}% ({drift}% drift). Potential cash drag.")
        else:
            obs_items.append(f"✓ **Asset Allocation In-Line**: Actual equity is {eq_pct}% (Target {target_eq}%).")

        top_sector = allocation_data.get("top_concentrated_sector", {})
        if top_sector and top_sector.get("weight_pct", 0) > 25.0:
            obs_items.append(f"⚠️ **Sector Concentration**: {top_sector.get('sector')} constitutes {top_sector.get('weight_pct')}% of total portfolio.")

        goals_items = []
        for g in client_data.get("goals", []):
            status_icon = "✓" if g.get("on_track") else "⚠️"
            goals_items.append(f"{status_icon} **{g.get('name')}** (Target ₹{round(g.get('target_inr')/100000, 1)}L by {g.get('target_year')}): Currently at {g.get('progress_pct')}%")

        disc_items = [
            f"1. Review asset allocation rebalance from current {eq_pct}% equity back towards target {target_eq}%.",
            f"2. Discuss profit-taking in {top_sector.get('sector', 'large caps')} to reallocate into fixed income instruments.",
            f"3. Review milestone schedule for {client_data.get('goals', [{}])[0].get('name', 'wealth goal') if client_data.get('goals') else 'retirement'}."
        ]

        meeting_brief = MEETING_BRIEF_TEMPLATE.format(
            client_name=client_name,
            client_code=client_data.get("client_code", "CL"),
            portfolio_val_lakh=tot_val_lakh,
            return_30d=portfolio_data.get("return_30d_pct", 0),
            return_1y=portfolio_data.get("return_1y_pct", 0),
            risk_profile=client_data.get("risk_profile", "Moderate"),
            equity_pct=eq_pct,
            debt_pct=debt_pct,
            cash_pct=cash_pct,
            target_equity_pct=target_eq,
            target_debt_pct=client_data.get("target_debt_pct", 25),
            target_cash_pct=client_data.get("target_cash_pct", 10),
            allocation_status=f"+{drift}% drift above target" if drift > 0 else f"{drift}% drift",
            key_observations="\n".join(obs_items),
            goals_status="\n".join(goals_items) if goals_items else "All primary goals tracked.",
            discussion_topics="\n".join(disc_items),
            governance_action="Human Review Required. Direct trading locked by Governance Policy 1."
        )

        # 4. Evaluate Governance Policies
        requires_approval = False
        approval_id = None
        action_type = "MEETING_BRIEF_GENERATION"
        rec_action = f"Discuss rebalancing equity exposure ({eq_pct}% -> {target_eq}%) during upcoming advisor review."

        # If rebalance is proposed or user query specifically requested a trade action
        wants_trade = any(w in query.lower() for w in ["rebalance", "sell", "buy", "execute trade", "order"])
        if wants_trade or is_rebalance_needed:
            action_type = "PORTFOLIO_REBALANCE_PROPOSAL"
            policy_eval = policy_engine.evaluate_action("EXECUTE_TRADE_REBALANCE")
            policy_checks.append(policy_eval)

            # Enforce Policy 1: AI cannot directly trade -> Create Pending Approval
            if policy_eval["requires_approval"]:
                requires_approval = True
                approval_record = await audit_logger.create_pending_approval(
                    db=db,
                    client_id=client_id,
                    action_type="PORTFOLIO_REBALANCE",
                    title=f"Rebalance Equity Allocation for {client_name}",
                    description=f"Trim equity holdings from {eq_pct}% to target {target_eq}% by reallocating ₹{round(tot_val * abs(drift)/100, 2):,.2f} into HDFC Corporate Bond / Liquid ETF.",
                    proposed_payload={
                        "client_id": client_id,
                        "current_equity_pct": eq_pct,
                        "target_equity_pct": target_eq,
                        "trim_amount_inr": round(tot_val * abs(drift)/100, 2),
                        "target_instruments": ["HDFCDEBT", "LIQUIDBEES"]
                    },
                    ai_reasoning=f"Portfolio has drifted {drift}% above client's approved risk profile tolerance.",
                    policy_violation_reasons="Policy 1: AI is strictly prohibited from executing market orders directly.",
                    urgency="High" if abs(drift) > 10.0 else "Medium"
                )
                approval_id = approval_record.id
        else:
            policy_checks.append(policy_engine.evaluate_action("ANALYZE_PORTFOLIO_AND_BRIEF"))

        # 5. Natural Language Response
        main_answer = f"""### Summary for {client_name}
{client_name}'s total portfolio value stands at **₹{tot_val_lakh} Lakhs** with a **30-day return of +{portfolio_data.get('return_30d_pct')}%**.

- **Asset Allocation Drift**: Current equity exposure is **{eq_pct}%**, which is **{drift:+0.1f}%** relative to the target allocation of **{target_eq}%**.
- **Performance & Volatility**: 1-year performance is **+{portfolio_data.get('return_1y_pct')}%** with annualized volatility score of **{portfolio_data.get('volatility_score')}%**.
- **Governance Action**: {"A rebalancing proposal has been submitted to your Pending Approvals queue for review." if requires_approval else "All analytical parameters are within standard thresholds."}
"""

        # 6. Immutable Audit Log Entry
        await audit_logger.log_event(
            db=db,
            action=action_type,
            user_id=user_id,
            client_id=client_id,
            agent_name="FinAdvisor Governed Agent",
            tool_used=", ".join([s.tool_name for s in tool_steps]),
            input_params={"query": query, "client_id": client_id},
            output_summary=f"Generated analysis for {client_name}. Equity drift: {drift}%. Approvals required: {requires_approval}",
            policy_result="REQUIRES_APPROVAL" if requires_approval else "PASSED",
            policy_details=json.dumps(policy_checks),
            human_approval_status="PENDING" if requires_approval else "NOT_REQUIRED"
        )

        return AgentChatResponse(
            query=query,
            client_id=client_id,
            answer=main_answer,
            meeting_brief=meeting_brief,
            recommended_action=rec_action,
            action_type=action_type,
            requires_approval=requires_approval,
            approval_id=approval_id,
            policy_checks=policy_checks,
            tools_executed=tool_steps,
            sources=list(set(sources)),
            timestamp=datetime.utcnow()
        )

governed_agent = GovernedAgentEngine()
