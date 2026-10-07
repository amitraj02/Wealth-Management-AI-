import random
from datetime import datetime, timedelta
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from backend.app.models.client import Client
from backend.app.models.portfolio import Portfolio, Holding
from backend.app.models.transaction import Transaction
from backend.app.models.goal import FinancialGoal
from backend.app.models.market import MarketTicker
from backend.app.models.approval import PendingApproval
from backend.app.models.audit import AiAuditLog
from backend.app.connectors.market_dhan_api import dhan_market_connector

fake = Faker('en_IN')
Faker.seed(42)
random.seed(42)

async def seed_database(db: AsyncSession):
    # Check if database already has clients
    count_res = await db.execute(select(func.count(Client.id)))
    existing_count = count_res.scalar()
    if existing_count and existing_count > 10:
        return

    # 1. Seed Market Tickers
    for sym, item in dhan_market_connector.MKT_INSTRUMENTS.items():
        ticker = MarketTicker(
            symbol=sym,
            name=item["name"],
            exchange="NSE",
            asset_class=item["asset_class"],
            sector=item["sector"],
            current_price=item["base_price"],
            change_pct=round(random.uniform(-1.5, 2.8), 2),
            day_high=round(item["base_price"] * 1.015, 2),
            day_low=round(item["base_price"] * 0.985, 2),
            high_52w=round(item["base_price"] * 1.30, 2),
            low_52w=round(item["base_price"] * 0.72, 2),
            pe_ratio=item["pe"],
            market_cap_cr=item["mcap_cr"],
            updated_at=datetime.utcnow()
        )
        db.add(ticker)

    await db.flush()

    # 2. Key Archetype Clients (Specified in project_structure.dm)
    archetypes = [
        {
            "code": "CL-101",
            "name": "Rajesh Kumar",
            "email": "rajesh.kumar@infotech.in",
            "phone": "+91 98201 44521",
            "city": "Mumbai",
            "age": 46,
            "risk_profile": "Moderate",
            "target_equity": 65.0,
            "target_debt": 25.0,
            "target_cash": 10.0,
            "annual_income": 6500000.0,
            "net_worth": 38000000.0,
            "portfolio_val": 4820000.0, # ₹48.2 Lakhs
            "equity_val": 3759600.0,    # 78% (Deviation!)
            "debt_val": 723000.0,       # 15%
            "cash_val": 337400.0,       # 7%
            "return_30d": 2.8,
            "return_1y": 15.4,
            "volatility": 16.8,
            "notes": "Senior Director at IT Firm. High concentration in tech stocks. Rebalance equity from 78% to 65% needed.",
            "holdings": [
                {"sym": "TCS", "name": "Tata Consultancy Services", "asset": "Equity", "sector": "Technology", "qty": 350, "avg": 3800.0, "cur": 4210.0, "val": 1473500.0, "wt": 30.57},
                {"sym": "INFY", "name": "Infosys Ltd", "asset": "Equity", "sector": "Technology", "qty": 650, "avg": 1620.0, "cur": 1890.75, "val": 1228987.5, "wt": 25.50},
                {"sym": "RELIANCE", "name": "Reliance Industries Ltd", "asset": "Equity", "sector": "Energy & Retail", "qty": 355, "avg": 2750.0, "cur": 2980.50, "val": 1057112.5, "wt": 21.93},
                {"sym": "HDFCDEBT", "name": "HDFC Corporate Bond Direct Growth", "asset": "Debt", "sector": "Fixed Income", "qty": 22700, "avg": 30.5, "cur": 31.85, "val": 723000.0, "wt": 15.00},
                {"sym": "LIQUIDBEES", "name": "Nippon India ETF Liquid BeES", "asset": "Cash", "sector": "Money Market", "qty": 337.4, "avg": 1000.0, "cur": 1000.0, "val": 337400.0, "wt": 7.00}
            ],
            "goals": [
                {"name": "Retirement Corpus", "target": 50000000.0, "cur": 28000000.0, "year": 2035, "on_track": True, "sip": 125000.0},
                {"name": "Child Overseas Master's", "target": 8000000.0, "cur": 6500000.0, "year": 2028, "on_track": True, "sip": 50000.0}
            ]
        },
        {
            "code": "CL-102",
            "name": "Amit Raj",
            "email": "amit.raj@ventures.io",
            "phone": "+91 97112 88410",
            "city": "Bengaluru",
            "age": 34,
            "risk_profile": "Aggressive",
            "target_equity": 80.0,
            "target_debt": 15.0,
            "target_cash": 5.0,
            "annual_income": 8200000.0,
            "net_worth": 42000000.0,
            "portfolio_val": 8200000.0,
            "equity_val": 6724000.0,
            "debt_val": 1148000.0,
            "cash_val": 328000.0,
            "return_30d": 6.4,
            "return_1y": 24.2,
            "volatility": 21.2,
            "notes": "Tech Startup Founder. Dhan Broker Client ID: 1104228365. Large transaction of ₹15L executed last week. High momentum seeker.",
            "holdings": [
                {"sym": "BAJFINANCE", "name": "Bajaj Finance Ltd", "asset": "Equity", "sector": "NBFC", "qty": 450, "avg": 6400.0, "cur": 7150.0, "val": 3217500.0, "wt": 39.24},
                {"sym": "TATAMOTORS", "name": "Tata Motors Ltd", "asset": "Equity", "sector": "Automobile", "qty": 2100, "avg": 820.0, "cur": 965.80, "val": 2028180.0, "wt": 24.73},
                {"sym": "ICICIBANK", "name": "ICICI Bank Ltd", "asset": "Equity", "sector": "Banking & Financials", "qty": 1216, "avg": 1050.0, "cur": 1215.40, "val": 1478320.0, "wt": 18.03},
                {"sym": "HDFCDEBT", "name": "HDFC Corporate Bond Direct Growth", "asset": "Debt", "sector": "Fixed Income", "qty": 36044, "avg": 31.0, "cur": 31.85, "val": 1148000.0, "wt": 14.00},
                {"sym": "LIQUIDBEES", "name": "Nippon India ETF Liquid BeES", "asset": "Cash", "sector": "Money Market", "qty": 328, "avg": 1000.0, "cur": 1000.0, "val": 328000.0, "wt": 4.00}
            ],
            "goals": [
                {"name": "Angel Investment Fund", "target": 20000000.0, "cur": 12000000.0, "year": 2029, "on_track": True, "sip": 150000.0}
            ]
        },
        {
            "code": "CL-103",
            "name": "Neha Singh",
            "email": "neha.singh@medcare.org",
            "phone": "+91 99304 12789",
            "city": "Delhi NCR",
            "age": 52,
            "risk_profile": "Conservative",
            "target_equity": 40.0,
            "target_debt": 45.0,
            "target_cash": 15.0,
            "annual_income": 3600000.0,
            "net_worth": 52000000.0,
            "portfolio_val": 9500000.0,
            "equity_val": 3325000.0,
            "debt_val": 4750000.0,
            "cash_val": 1425000.0,
            "return_30d": 0.9,
            "return_1y": 8.1,
            "volatility": 7.5,
            "notes": "Surgeon. Priority is overseas medical education fund for daughter falling behind target timeline.",
            "holdings": [
                {"sym": "ICICIGILT", "name": "ICICI Prudential Gilt Fund", "asset": "Debt", "sector": "Govt Securities", "qty": 35000, "avg": 91.0, "cur": 94.20, "val": 3297000.0, "wt": 34.70},
                {"sym": "HDFCDEBT", "name": "HDFC Corporate Bond Direct Growth", "asset": "Debt", "sector": "Fixed Income", "qty": 45620, "avg": 31.2, "cur": 31.85, "val": 1453000.0, "wt": 15.30},
                {"sym": "HDFCBANK", "name": "HDFC Bank Ltd", "asset": "Equity", "sector": "Banking & Financials", "qty": 1200, "avg": 1580.0, "cur": 1645.20, "val": 1974240.0, "wt": 20.78},
                {"sym": "HINDUNILVR", "name": "Hindustan Unilever Ltd", "asset": "Equity", "sector": "FMCG", "qty": 496, "avg": 2600.0, "cur": 2720.00, "val": 1350760.0, "wt": 14.22},
                {"sym": "LIQUIDBEES", "name": "Nippon India ETF Liquid BeES", "asset": "Cash", "sector": "Money Market", "qty": 1425, "avg": 1000.0, "cur": 1000.0, "val": 1425000.0, "wt": 15.00}
            ],
            "goals": [
                {"name": "Overseas Medical Degree", "target": 12000000.0, "cur": 5500000.0, "year": 2027, "on_track": False, "sip": 180000.0}
            ]
        }
    ]

    all_client_models = []

    # Insert Archetypes
    for arch in archetypes:
        client = Client(
            client_code=arch["code"],
            full_name=arch["name"],
            email=arch["email"],
            phone=arch["phone"],
            city=arch["city"],
            age=arch["age"],
            risk_profile=arch["risk_profile"],
            target_equity_pct=arch["target_equity"],
            target_debt_pct=arch["target_debt"],
            target_cash_pct=arch["target_cash"],
            annual_income=arch["annual_income"],
            net_worth=arch["net_worth"],
            kyc_status="VERIFIED",
            advisor_notes=arch["notes"]
        )
        db.add(client)
        await db.flush()
        all_client_models.append(client)

        portfolio = Portfolio(
            client_id=client.id,
            account_number="DHAN-1104228365" if arch["name"] == "Amit Raj" else f"IN-NSDL-{client.id:04d}",
            total_value=arch["portfolio_val"],
            equity_value=arch["equity_val"],
            debt_value=arch["debt_val"],
            cash_value=arch["cash_val"],
            realized_pnl=round(arch["portfolio_val"] * 0.08, 2),
            unrealized_pnl=round(arch["portfolio_val"] * 0.14, 2),
            return_30d_pct=arch["return_30d"],
            return_1y_pct=arch["return_1y"],
            volatility_score=arch["volatility"],
            sharpe_ratio=1.75
        )
        db.add(portfolio)
        await db.flush()

        for h in arch["holdings"]:
            holding = Holding(
                portfolio_id=portfolio.id,
                symbol=h["sym"],
                name=h["name"],
                asset_class=h["asset"],
                sector=h["sector"],
                quantity=h["qty"],
                avg_buy_price=h["avg"],
                current_price=h["cur"],
                market_value=h["val"],
                unrealized_pnl=round(h["val"] - (h["qty"] * h["avg"]), 2),
                unrealized_pnl_pct=round(((h["cur"] - h["avg"]) / h["avg"]) * 100, 2),
                weight_pct=h["wt"]
            )
            db.add(holding)

        for g in arch["goals"]:
            goal = FinancialGoal(
                client_id=client.id,
                goal_name=g["name"],
                target_amount=g["target"],
                current_amount=g["cur"],
                target_year=g["year"],
                priority="High",
                status="IN_PROGRESS" if g["on_track"] else "OFF_TRACK",
                on_track=g["on_track"],
                required_monthly_sip=g["sip"]
            )
            db.add(goal)

        # Add initial transactions
        for sym_data in arch["holdings"][:3]:
            txn = Transaction(
                client_id=client.id,
                txn_ref=f"TXN-NSE-{random.randint(100000, 999999)}",
                symbol=sym_data["sym"],
                asset_class=sym_data["asset"],
                txn_type="BUY",
                quantity=sym_data["qty"] * 0.3,
                price=sym_data["cur"] * 0.95,
                total_amount=round((sym_data["qty"] * 0.3) * (sym_data["cur"] * 0.95), 2),
                status="EXECUTED",
                notes=f"Systematic accumulation for {arch['name']}",
                timestamp=datetime.utcnow() - timedelta(days=random.randint(2, 45))
            )
            db.add(txn)

    # 3. Generate 17 synthetic clients to make exactly 20 clients total
    indian_cities = ["Mumbai", "Bengaluru", "Delhi NCR", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad"]
    profiles = ["Conservative", "Moderate", "Aggressive"]
    
    for i in range(104, 121):
        first_name = fake.first_name()
        last_name = fake.last_name()
        full_name = f"{first_name} {last_name}"
        city = random.choice(indian_cities)
        profile = random.choice(profiles)
        
        target_eq = 40.0 if profile == "Conservative" else (65.0 if profile == "Moderate" else 80.0)
        target_debt = 45.0 if profile == "Conservative" else (25.0 if profile == "Moderate" else 15.0)
        target_cash = 100.0 - target_eq - target_debt

        tot_val = round(random.uniform(1500000, 35000000), 2)
        
        # Inject realistic drift
        drift = random.uniform(-12.0, 15.0)
        actual_eq_pct = max(10.0, min(95.0, target_eq + drift))
        actual_debt_pct = max(5.0, min(80.0, target_debt - (drift * 0.7)))
        actual_cash_pct = max(2.0, 100.0 - actual_eq_pct - actual_debt_pct)

        client = Client(
            client_code=f"CL-{i}",
            full_name=full_name,
            email=f"{first_name.lower()}.{last_name.lower()}{i}@wealthmail.in",
            phone=f"+91 9{random.randint(100000000, 999999999)}",
            city=city,
            age=random.randint(28, 68),
            risk_profile=profile,
            target_equity_pct=target_eq,
            target_debt_pct=target_debt,
            target_cash_pct=target_cash,
            annual_income=round(tot_val * random.uniform(0.3, 0.7), 2),
            net_worth=round(tot_val * random.uniform(2.5, 6.0), 2),
            kyc_status="VERIFIED" if random.random() > 0.05 else "PENDING",
            advisor_notes=f"Quarterly review schedule. Managed portfolio by FinAdvisor AI platform."
        )
        db.add(client)
        await db.flush()

        eq_val = round(tot_val * (actual_eq_pct / 100), 2)
        debt_val = round(tot_val * (actual_debt_pct / 100), 2)
        cash_val = round(tot_val * (actual_cash_pct / 100), 2)

        portfolio = Portfolio(
            client_id=client.id,
            account_number=f"IN-NSDL-{client.id:04d}",
            total_value=tot_val,
            equity_value=eq_val,
            debt_value=debt_val,
            cash_value=cash_val,
            realized_pnl=round(tot_val * random.uniform(0.02, 0.15), 2),
            unrealized_pnl=round(tot_val * random.uniform(-0.04, 0.22), 2),
            return_30d_pct=round(random.uniform(-2.5, 5.8), 2),
            return_1y_pct=round(random.uniform(6.0, 26.0), 2),
            volatility_score=round(random.uniform(8.5, 22.0), 2),
            sharpe_ratio=round(random.uniform(1.2, 2.1), 2)
        )
        db.add(portfolio)
        await db.flush()

        # Add 3-5 holdings per client
        holding_syms = random.sample(list(dhan_market_connector.MKT_INSTRUMENTS.keys()), k=4)
        for sym in holding_syms:
            item = dhan_market_connector.MKT_INSTRUMENTS[sym]
            h_val = round(tot_val * random.uniform(0.10, 0.35), 2)
            qty = round(h_val / item["base_price"], 2)
            h = Holding(
                portfolio_id=portfolio.id,
                symbol=sym,
                name=item["name"],
                asset_class=item["asset_class"],
                sector=item["sector"],
                quantity=qty,
                avg_buy_price=round(item["base_price"] * random.uniform(0.85, 1.1), 2),
                current_price=item["base_price"],
                market_value=h_val,
                unrealized_pnl=round(h_val * random.uniform(-0.08, 0.25), 2),
                unrealized_pnl_pct=round(random.uniform(-8.0, 25.0), 2),
                weight_pct=round((h_val / tot_val) * 100, 2)
            )
            db.add(h)

        # Add financial goal
        g_target = round(tot_val * random.uniform(1.5, 3.5), 2)
        g_cur = round(g_target * random.uniform(0.2, 0.85), 2)
        goal = FinancialGoal(
            client_id=client.id,
            goal_name=random.choice(["Retirement Security", "Child Education", "Dream Vacation Home", "Wealth Legacy"]),
            target_amount=g_target,
            current_amount=g_cur,
            target_year=random.randint(2028, 2040),
            priority=random.choice(["High", "Medium"]),
            status="IN_PROGRESS" if g_cur / g_target > 0.4 else "OFF_TRACK",
            on_track=True if g_cur / g_target > 0.4 else False,
            required_monthly_sip=round(random.uniform(25000, 150000), 2)
        )
        db.add(goal)

        # Add transactions
        for _ in range(random.randint(2, 6)):
            t_sym = random.choice(holding_syms)
            t_amt = round(random.uniform(20000, 250000), 2)
            txn = Transaction(
                client_id=client.id,
                txn_ref=f"TXN-NSE-{random.randint(100000, 999999)}",
                symbol=t_sym,
                asset_class="Equity",
                txn_type=random.choice(["BUY", "BUY", "SELL", "DIVIDEND"]),
                quantity=round(t_amt / 1500.0, 2),
                price=1500.0,
                total_amount=t_amt,
                status="EXECUTED",
                notes="Portfolio rebalance / SIP flow",
                timestamp=datetime.utcnow() - timedelta(days=random.randint(1, 90))
            )
            db.add(txn)

    # 4. Seed Initial Governance Pending Approvals
    pending_1 = PendingApproval(
        client_id=all_client_models[0].id, # Rajesh Kumar
        action_type="PORTFOLIO_REBALANCE",
        title="Rebalance Equity Allocation for Rajesh Kumar",
        description="Equity exposure currently stands at 78% vs target 65%. Proposed reallocation of ₹6.2 Lakhs from technology stocks to Fixed Income & Liquid ETF.",
        proposed_payload={
            "client_id": all_client_models[0].id,
            "sell": [{"symbol": "TCS", "amount": 350000}, {"symbol": "INFY", "amount": 270000}],
            "buy": [{"symbol": "HDFCDEBT", "amount": 420000}, {"symbol": "LIQUIDBEES", "amount": 200000}]
        },
        ai_reasoning="Portfolio volatility increased to 16.8% with heavy tech concentration. Client mandate requires maximum 65% equity exposure.",
        policy_violation_reasons="Policy 1: AI cannot execute market trades without human advisor sign-off.",
        urgency="High",
        status="PENDING",
        created_at=datetime.utcnow() - timedelta(hours=2)
    )
    db.add(pending_1)

    pending_2 = PendingApproval(
        client_id=all_client_models[1].id, # Amit Raj
        action_type="CLIENT_EMAIL_DRAFT",
        title="Send Tax Harvesting Brief to Amit Raj",
        description="Draft email highlighting ₹1.8 Lakhs short-term capital gains tax optimization before fiscal year-end.",
        proposed_payload={
            "recipient": "amit.raj@ventures.io",
            "subject": "FinAdvisor Insights: Capital Gains Harvesting Strategy",
            "body": "Dear Amit, Following your recent ESOP liquidation, we have modeled an tax-loss harvesting opportunity..."
        },
        ai_reasoning="Quarterly tax optimization review triggered by large transaction volume.",
        policy_violation_reasons="Policy 3: Outbound client communication requires advisor authorization.",
        urgency="Medium",
        status="PENDING",
        created_at=datetime.utcnow() - timedelta(hours=4)
    )
    db.add(pending_2)

    # 5. Seed Initial AI Audit Logs
    audit_1 = AiAuditLog(
        timestamp=datetime.utcnow() - timedelta(hours=2),
        user_id="advisor_main",
        client_id=all_client_models[0].id,
        agent_name="FinAdvisor Governed Agent",
        action="PORTFOLIO_REBALANCE_PROPOSAL",
        tool_used="calculate_asset_allocation, get_portfolio",
        input_params={"client_id": all_client_models[0].id},
        output_summary="Detected +13% equity allocation drift. Blocked autonomous trade execution. Created pending approval.",
        policy_result="REQUIRES_APPROVAL",
        policy_details="Policy 1 Triggered: Trade Execution Prohibited for AI",
        human_approval_status="PENDING"
    )
    db.add(audit_1)

    audit_2 = AiAuditLog(
        timestamp=datetime.utcnow() - timedelta(hours=5),
        user_id="advisor_main",
        client_id=all_client_models[2].id, # Neha Singh
        agent_name="FinAdvisor Governed Agent",
        action="GENERATE_MEETING_BRIEF",
        tool_used="get_client_profile, get_portfolio, search_client_documents",
        input_params={"client_id": all_client_models[2].id},
        output_summary="Generated meeting brief for Dr. Neha Singh. Highlighted education goal deficit.",
        policy_result="PASSED",
        policy_details="Policy Check PASSED: Read-only briefing operation.",
        human_approval_status="NOT_REQUIRED"
    )
    db.add(audit_2)

    await db.commit()
