# 📘 FinAdvisor AI — Beginner's Guide & Project Walkthrough

Welcome! This guide explains the entire project in plain, simple English so you can understand every part of the codebase and speak about it confidently in interviews.

---

## 🎯 1. What is this project in 1 simple sentence?
> **FinAdvisor AI** is an intelligent assistant for financial advisors that collects client and market data, calculates risks, and drafts recommendations, but **never trades on its own without human approval**.

---

## 🧠 2. The Core Problem & The "Human-in-the-Loop" Solution

### ❌ The Danger of Naive AI in Finance:
If you give an AI direct access to buy/sell stocks or change client records, a hallucination or market flash crash could cause severe financial loss.

### ✅ How Our System Solves It (Governance):
1. The AI does the heavy lifting: analyzing portfolios, calculating asset allocation drifts, and drafting meeting notes.
2. If an action has real consequences (like rebalancing stocks or emailing a client), the AI **must submit a proposal to the Advisor's Approval Queue**.
3. A real human clicks **"Authorize"** or **"Reject"**.
4. Every single step is recorded in an **Audit Log**.

---

## 📂 3. Project Structure Made Simple

Here is how the project files are organized:

```
Wealth_n_Asset_Management/
│
├── start.sh                      <-- 🚀 START HERE! Runs both backend & frontend with 1 click
│
├── backend/                      <-- 🐍 PYTHON FASTAPI BACKEND
│   ├── app/
│   │   ├── main.py               <-- Application entry point (connects routers & DB)
│   │   ├── connectors/           <-- Grabs data from Dhan Market API, CRM, & Custodian
│   │   │   ├── market_dhan_api.py<-- Market prices (RELIANCE, TCS, NIFTY 50, etc.)
│   │   │   └── validation.py     <-- Checks data for errors before saving
│   │   ├── mcp/                  <-- Model Context Protocol (AI Tools)
│   │   │   └── tools.py          <-- get_portfolio(), calculate_allocation(), etc.
│   │   ├── agent/                <-- AI Agent Engine
│   │   │   └── engine.py         <-- Executes tools, applies rules, generates briefs
│   │   ├── governance/           <-- Enterprise Guardrails
│   │   │   ├── policy_engine.py  <-- 5 Rules (No direct trading, data protection)
│   │   │   └── audit_logger.py   <-- Records every action to the database
│   │   ├── routers/              <-- REST API Endpoints (/clients, /advisor, /agent)
│   │   └── data/seed_data.py     <-- Creates 20 realistic clients (Rajesh, Amit Raj, Neha)
│
└── frontend/                     <-- ⚛️ REACT + VITE DASHBOARD (Light Theme)
    └── src/
        ├── App.jsx               <-- Main view & navigation switcher
        ├── components/           <-- Modals, Navbar, Stat cards, Client 360 Drawer
        └── pages/
            ├── DashboardPage.jsx <-- "Prepare My Day" & KPI cards
            ├── ClientsPage.jsx   <-- List of 20 clients with search & filter
            ├── AgentChatPage.jsx <-- Chat with AI with real-time tool execution trace
            ├── GovernanceAuditPage.jsx <-- Human approval queue & audit trail
            └── IntegrationsPage.jsx <-- Architecture diagram & live Dhan quotes
```

---

## 🚦 4. The 4 Phases of How Data Flows

```
[ Phase 1: Ingestion ] ──> [ Phase 2: AI Analysis ] ──> [ Phase 3: MCP Tools ] ──> [ Phase 4: Governance ]
Dhan API + Custody CRM      Calculates Returns & Drift     Fetches verified figures    Advisor Approves/Rejects
```

1. **Phase 1 (Data)**: The backend fetches stock quotes from Dhan and client balances from Custody, validates them with Pydantic, and saves them in the database.
2. **Phase 2 (AI)**: The advisor asks a question (or clicks "Prepare My Day"). The AI reads the data.
3. **Phase 3 (MCP Tools)**: The AI picks specific tools (like `calculate_asset_allocation()` or `get_market_data()`) to compute exact numbers instead of guessing.
4. **Phase 4 (Governance)**: If the AI wants to fix an allocation (e.g. Rajesh Kumar has 78% equity vs 65% target), it creates a **Pending Approval**. The advisor reviews and approves it.

---

## 🎤 5. How to Answer Interview Questions

### Q1: "What does your project do?"
> **Your Answer:**  
> *"I built FinAdvisor AI, a governed wealth management assistant. It integrates client data and Dhan market feeds, exposes verified analytical tools to an AI agent via MCP, and enforces a strict Human-in-the-Loop policy engine so AI cannot execute trades without advisor approval."*

### Q2: "What is the killer feature?"
> **Your Answer:**  
> *"The 'Prepare My Day' feature. With one click, the system scans all 120+ client portfolios against live market prices and prioritizes clients into 🔴 Critical, 🟡 Review, and 🟢 On Track, while auto-generating meeting briefs."*

### Q3: "What is an MCP tool?"
> **Your Answer:**  
> *"Model Context Protocol (MCP) gives the LLM deterministic, verified tools (like querying live stock prices or calculating Sharpe ratios) so the AI never hallucinates financial figures."*

---

## 💻 6. How to Run with 1 Command

Open your terminal in this folder and simply run:
```bash
./start.sh
```

- **Frontend:** [http://127.0.0.1:5173](http://127.0.0.1:5173)
- **Backend API Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
