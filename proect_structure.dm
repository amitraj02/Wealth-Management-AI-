Project name: "FinAdvisor AI " — Governed AI Agent for Wealth Management
Your GitHub repository could be: finadvisor-ai
 
 1. What the application does

Imagine an advisor has 100 clients.

Your system receives:

Client Data
Portfolio Data
Transactions
Market Data
Financial Goals
Documents

Then your system automatically creates:

Client Profile
       ↓
Portfolio Analysis
       ↓
Risk / Performance Analysis
       ↓
AI Agent
       ↓
Important Insights
       ↓
Recommended Actions
       ↓
Human Approval
       ↓
Audit Log

For example:

Client: Rajesh Kumar
Portfolio: ₹48 lakh
Equity allocation: 78%
Debt allocation: 15%
Cash: 7%

The AI agent could generate:

"Equity exposure is above the client's target allocation of 65%. Portfolio volatility has increased over the last 30 days. Review allocation before the next client meeting."

And importantly:

AI does NOT automatically execute a trade.

It creates an advisor recommendation that a human can approve/reject.

That "human-in-the-loop" concept is very important for a financial AI application.

2. Architecture

I would build it like this:

                  ┌──────────────────┐
                  │   React Frontend │
                  └────────┬─────────┘
                           │
                         REST
                           │
                  ┌────────▼─────────┐
                  │    FastAPI       │
                  │     Backend      │
                  └────────┬─────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
     Client API       Portfolio API    Market API
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                 ┌──────────────────┐
                 │ Data Integration │
                 │     Layer        │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   PostgreSQL     │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   AI Agent       │
                 │                  │
                 │ LLM + Tools      │
                 └────────┬─────────┘
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
          Analyze      Recommend    Summarize
             │            │            │
             └────────────┼────────────┘
                          ▼
                  ┌───────────────┐
                  │ Human Review  │
                  └───────┬───────┘
                          ▼
                    Audit Log

This gives you a very strong interview discussion.

3. The most important part: Data Integration

This is where I would make your project different from a normal AI project.

Create several mock/external APIs.

For example:

/client/{id}
/portfolio/{client_id}
/transactions/{client_id}
/market/{symbol}
/goals/{client_id}

Your integration service pulls information from them.

Example:

Client API
     ↓
JSON
     ↓
Validation
     ↓
Transformation
     ↓
PostgreSQL

Then:

Portfolio API
     ↓
JSON
     ↓
Validation
     ↓
Transformation
     ↓
PostgreSQL

Now you can tell the interviewer:

"I built a data integration layer that consumes multiple financial APIs, validates and normalizes their data, and creates a unified model that the AI agent can use."

That sentence is much more powerful than saying "I built an AI chatbot."

4. Give the AI Agent tools

This is where the project becomes agentic AI rather than a simple ChatGPT wrapper.

Give the agent tools such as:

get_client_profile()
get_portfolio()
get_transactions()
get_market_price()
calculate_portfolio_return()
calculate_asset_allocation()
search_client_documents()
create_advisor_report()
create_followup_task()

Then the AI can decide which tool it needs.

Example:

User:

"Prepare me for tomorrow's meeting with Rajesh."

Agent:

1. get_client_profile()
2. get_portfolio()
3. get_transactions()
4. get_market_price()
5. calculate_portfolio_return()
6. analyze()
7. create_meeting_brief()

Final output:

CLIENT MEETING BRIEF

Client:
Rajesh Kumar

Portfolio:
₹48.2 L

30-day return:
+2.8%

Major change:
Equity allocation increased from 65% → 78%

Potential concern:
Portfolio concentration in technology stocks

Suggested discussion:
Review equity allocation and concentration.

Recent activity:
3 large equity purchases

ACTION:
Advisor review required
5. Add "Governance"

This is the part I would really emphasize because Raj AI positions itself around governed AI.

Don't let the AI simply do whatever it wants.

Create rules:

AI Agent
   ↓
Policy Engine
   ↓
Is action allowed?
   │
   ├── YES → continue
   │
   └── NO → Human approval

Example policies:

Policy 1:
AI cannot execute trades.

Policy 2:
AI cannot modify client financial data.

Policy 3:
AI cannot send client communication without approval.

Policy 4:
Sensitive client information must be protected.

Policy 5:
Every AI action must be logged.

Now create an audit table:

ai_audit_log

id
timestamp
user_id
client_id
agent
action
tool_used
input
output
policy_result
human_approval

This gives you a fantastic interview talking point.

6. Add an MCP server

Since the Raj AI Data & Integration role specifically mentions MCP servers for agentic AI, I would add a small MCP layer.

Architecture:

                 AI Agent
                    │
                    ▼
               MCP Server
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
 get_client()  get_portfolio()  get_market()
       │            │            │
       └────────────┼────────────┘
                    ▼
                Database

You don't need 20 tools.

Start with:

get_client_profile
get_portfolio
get_transactions
get_market_data
calculate_returns
create_meeting_brief

That's enough for an impressive MVP.

7. Dashboard

Your React dashboard could have four major pages.

Dashboard
┌────────────────────────────────────────────┐
│ FINADVISOR AI                              │
├────────────────────────────────────────────┤
│                                            │
│ Clients             127                    │
│ AUM                 ₹48.7 Cr               │
│ Alerts              14                     │
│ Pending Approval    6                      │
│                                            │
├────────────────────────────────────────────┤
│ PRIORITY CLIENTS                           │
│                                            │
│ Rajesh Kumar       High concentration      │
│ Amit Sharma        Goal deviation          │
│ Neha Singh         Portfolio review        │
│                                            │
└────────────────────────────────────────────┘
Client page
Rajesh Kumar

Portfolio       ₹48.2 L
Return          +8.4%
Risk            Medium
Equity          78%
Debt            15%
Cash             7%

[AI ANALYSIS]

⚠ Equity allocation above target
⚠ Technology concentration increased
✓ Emergency fund adequate

[Generate Meeting Brief]
[Create Follow-up]
AI Agent page
Ask Financial Advisor AI

> Why should I review Rajesh's portfolio?

AI:

Rajesh's equity allocation is currently 78%,
compared with the target of 65%.

The increase occurred because of recent
technology-stock purchases.

Recommended:
Discuss portfolio allocation during the
next client meeting.

Sources:
Portfolio DB
Transaction DB
Market API

[Approve] [Reject]
Audit page
AI ACTIVITY LOG

10:32  Agent accessed portfolio
10:32  Agent accessed transactions
10:33  Agent calculated allocation
10:33  Policy check: PASSED
10:34  Meeting brief generated
10:35  Human approval: PENDING
8. Technology stack

I recommend:

Layer	Technology
Frontend	React / Next.js
Backend	Python + FastAPI
Database	PostgreSQL
AI	LLM API
Agent	Python
MCP	Python MCP server
Data processing	Pandas
API	REST
Authentication	JWT
Validation	Pydantic
Testing	pytest
Container	Docker
Version control	Git/GitHub
Deployment	Vercel + Render/Railway/etc.

You already know a significant portion of this stack.

9. Don't use real customer data

Use synthetic data.

Create:

clients.csv
portfolios.csv
transactions.csv
holdings.csv
goals.csv

Generate perhaps:

500 clients

5,000 transactions

2,000 holdings

This makes the project look much more realistic.

10. The killer feature

I would add one feature specifically designed to impress the interviewer:

"Prepare My Day"

Advisor clicks:

Prepare My Day

The AI scans:

500 clients
       ↓
Portfolio changes
       +
Transactions
       +
Market events
       +
Goals
       +
Previous meetings
       ↓
AI Agent
       ↓
Priority ranking

Output:

TODAY'S PRIORITIES

🔴 3 clients require immediate attention

1. Rajesh Kumar
   Portfolio allocation deviation

2. Amit Sharma
   Large transaction detected

3. Neha Singh
   Financial goal falling behind

🟡 7 clients worth reviewing

🟢 23 clients no action required

This is much closer to the business problem Raj AI is trying to solve.

11. How you should explain it in the interview

If they ask:

"Tell me about your project."

Don't say:

"I made an AI chatbot for financial advisors."

Say:

"I built a prototype of a governed AI platform for wealth-management workflows. The system integrates client, portfolio, transaction and market data through APIs, normalizes it into a unified database, and exposes that information to an AI agent through tools/MCP. The agent can analyze a client's portfolio and prepare meeting briefs or recommended actions. I also implemented policy checks and audit logging so that the AI cannot independently execute sensitive financial actions. Human approval is required for consequential actions."

That's a very strong answer for this company.

12. Build it in 4 stages

Don't try to build everything at once.

Phase 1 — Data
FastAPI
   ↓
Mock Financial APIs
   ↓
PostgreSQL
Phase 2 — AI
Database
   ↓
AI Agent
   ↓
Portfolio Analysis
Phase 3 — Agent tools/MCP
AI
 ↓
MCP
 ↓
Financial Tools
 ↓
Database/APIs
Phase 4 — Governance
AI
 ↓
Policy Engine
 ↓
Human Approval
 ↓
Audit Log
Your existing Dhan project can help

You don't need to throw away your existing trading project.

Use it as your market-data connector.

For example:

                 FINADVISOR AI

Client API ────────┐
Portfolio API ─────┤
Transaction API ───┤
                    ├──→ Integration Layer
Dhan Market API ───┤
                    │
                    ▼
                PostgreSQL
                    │
                    ▼
                 AI Agent
                    │
                    ▼
             Advisor Dashboard