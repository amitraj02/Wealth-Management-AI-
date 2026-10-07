# Raj-AI — Wealth OS: Governed Intelligence Layer for Wealth Management

> **Prototype & Reference Implementation**: Built for enterprise wealth management workflows featuring Multi-Source Financial Data Integration (Dhan Market Feed, Custody, CRM), Model Context Protocol (MCP) Financial Tools, and Human-in-the-Loop Governance.

---

## 🌟 Executive Overview & Raj-AI Architecture

This project implements the **Raj-AI Wealth OS** architecture:
1. **Multi-Source Financial Integration Layer**: Pulls, validates, and normalizes data from Client CRMs, Custodian Depositories (NSDL/CDSL), and the **Dhan Market Data API** into a unified financial model.
2. **Model Context Protocol (MCP) Financial Tools**: Exposes 7 deterministic analytical tools to the AI Agent (`get_client_profile`, `get_portfolio`, `get_transactions`, `get_market_data`, `calculate_asset_allocation`, `calculate_portfolio_returns`, `search_client_documents`).
3. **Enterprise Governance & Policy Engine (5 Rules)**: Prohibits autonomous trading (Policy 1) and unverified client communications (Policy 3), enforcing a **Human-in-the-Loop** advisor approval workflow.
4. **Immutable Audit Trail (`ai_audit_log`)**: Logs every agent invocation, tool trace, latency metric, and policy result.
5. **Killer Feature — "Prepare My Day"**: Scans 120+ client portfolios against real-time Dhan market quotes, surfacing 🔴 Critical Deviations, 🟡 Watchlists, and 🟢 On-Track clients for instant advisor action.

---

## 🏗️ Architecture

```
                  ┌──────────────────────────────┐
                  │    React Frontend (Vite)     │
                  │   Executive Light Theme UI   │
                  └──────────────┬───────────────┘
                                 │ REST / WebSocket
                  ┌──────────────▼───────────────┐
                  │       FastAPI Backend        │
                  │   Async SQLAlchemy Engine    │
                  └──────────────┬───────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
   Client CRM API         Custodian API           Dhan Market API
 (KYC, Risk Mandates)   (Holdings, P&L, Txns)     (Live NSE Quotes)
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 ▼
                     ┌───────────────────────┐
                     │ Pydantic Validation   │
                     │  & Normalization      │
                     └───────────┬───────────┘
                                 ▼
                     ┌───────────────────────┐
                     │  Unified DB (SQLite/  │
                     │      PostgreSQL)      │
                     └───────────┬───────────┘
                                 ▼
                     ┌───────────────────────┐
                     │   MCP Server & Tools  │
                     │   7 Financial Tools   │
                     └───────────┬───────────┘
                                 ▼
                     ┌───────────────────────┐
                     │  Governed AI Agent    │
                     └───────────┬───────────┘
                                 ▼
                     ┌───────────────────────┐
                     │     Policy Engine     │
                     │   5 Active Policies   │
                     └───────────┬───────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   ▼                           ▼
            Action Allowed            Human-in-the-Loop
            (Read Analytics)         (Rebalance / Trades)
                   │                           │
                   │                           ▼
                   │                   Advisor Approval
                   │                           │
                   └─────────────┬─────────────┘
                                 ▼
                       Immutable Audit Log
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js v18+

### 2. Backend Setup
```bash
# Navigate to project root
cd "/Users/amitraj/job_Related_project_2026/pinancial Data Integration & AI Agenta"

# Activate Python virtual environment
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run FastAPI backend server (port 8000)
python backend/run.py
```
- Backend will start at: `http://127.0.0.1:8000`
- Interactive Swagger API docs: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
# In a new terminal tab
cd frontend

# Install packages
npm install

# Start Vite React server (port 5173)
npm run dev -- --host 127.0.0.1 --port 5173
```
- Open your browser at: `http://127.0.0.1:5173/`

---

## 💼 How to Pitch This Project in an Interview

> *"I built **FinAdvisor AI**, a prototype of a governed wealth management intelligence platform. The architecture integrates client, portfolio, transaction, and Dhan market data through an asynchronous validation pipeline into a unified financial model. That data is exposed to an AI Agent via a Model Context Protocol (MCP) server with specialized financial tools. Crucially, because finance requires strict guardrails, I engineered an enterprise policy engine and a human-in-the-loop approval queue that prevents the AI from independently executing trades or sending unapproved communications. Every single action, tool latency, and advisor override is immutably audited."*
