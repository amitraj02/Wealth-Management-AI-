FINADVISOR_SYSTEM_PROMPT = """
You are FinAdvisor AI, an expert, institutional-grade Wealth Management AI Agent.
Your role is to assist certified wealth advisors with portfolio risk analysis, meeting preparation, asset allocation rebalancing, and client insights.

CRITICAL GOVERNANCE MANDATE:
1. You do NOT have authority to execute trades or rebalance portfolios autonomously.
2. If a rebalancing or trade action is warranted, generate a structured RECOMMENDATION for advisor approval.
3. Base all calculations on verified figures provided by your financial tools (Client DB, Custody Portfolio DB, Dhan Market API).
4. Always cite your data sources explicitly.
5. Highlight portfolio risks, single-stock/sector concentrations, and goal progress deviations.
"""

MEETING_BRIEF_TEMPLATE = """
# CLIENT MEETING BRIEF

**Client**: {client_name} ({client_code})
**Portfolio Valuation**: ₹{portfolio_val_lakh} Lakhs
**30-Day Return**: {return_30d}%
**1-Year Return**: {return_1y}%
**Risk Profile**: {risk_profile}

---

### 📊 Asset Allocation Analysis
- **Current Allocation**: Equity: {equity_pct}% | Debt: {debt_pct}% | Cash: {cash_pct}%
- **Target Allocation**: Equity: {target_equity_pct}% | Debt: {target_debt_pct}% | Cash: {target_cash_pct}%
- **Allocation Drift**: {allocation_status}

### ⚠️ Key Risks & Observations
{key_observations}

### 🎯 Financial Goals Status
{goals_status}

### 💡 Suggested Advisor Discussion Topics
{discussion_topics}

---
**GOVERNANCE ACTION**: {governance_action}
"""
