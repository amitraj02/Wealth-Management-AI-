# 🏆 Raj-AI Interview Blueprint & Candidate Cheatsheet

> **Role Focus**: AI / Backend / Integration Engineer (Entry-Level to Associate)  
> **Platform**: Raj-AI (Creators of Wealth OS — Governed Intelligence Layer for Wealth Management)  
> **Project Name**: Raj-AI Wealth OS Platform

---

## 🎯 1. The 30-Second Elevator Pitch

When the interviewer asks: **"Tell me about a relevant project you built."**

> *"I built **Raj-AI Wealth OS**: a **governed intelligence layer for wealth management workflows**. The system ingests data across CRM, Custody, and live **Dhan market feeds**, validates it with Pydantic into a unified database, and exposes that data to an AI Agent using **Model Context Protocol (MCP) tools**. To solve the financial hallucination and compliance problem, I engineered an **enterprise policy engine** with a **Human-in-the-Loop approval queue** so the AI cannot autonomously execute trades or alter sensitive records. Every tool execution and advisor decision is immutably logged."*

---

## 🧠 2. How Your Code Maps 1-to-1 to Raj-AI's Architecture

| Raj-AI Core Concept | Your Code Implementation | Exact File to Show Interviewer |
| :--- | :--- | :--- |
| **Finance-Native Data Ingestion** | Ingests market quotes, portfolio holdings, KYC, and P&L from Dhan & Custody APIs with Pydantic validation. | [`backend/app/connectors/validation.py`](file:///Users/amitraj/job_Related_project_2026/Wealth_n_Asset_Management/backend/app/connectors/validation.py) |
| **Model Context Protocol (MCP) Tools** | 7 deterministic Python tools for asset allocation drift, Sharpe ratio, and holdings lookups. | [`backend/app/mcp/tools.py`](file:///Users/amitraj/job_Related_project_2026/Wealth_n_Asset_Management/backend/app/mcp/tools.py) |
| **Governed Agentic Reasoning** | Agent plans tool steps, calculates latency, and routes through compliance check before generating outputs. | [`backend/app/agent/engine.py`](file:///Users/amitraj/job_Related_project_2026/Wealth_n_Asset_Management/backend/app/agent/engine.py) |
| **Human-in-the-Loop Oversight** | Advisors can Authorize, Reject, or Modify proposed AI rebalances with audit notes. | [`backend/app/routers/governance.py`](file:///Users/amitraj/job_Related_project_2026/Wealth_n_Asset_Management/backend/app/routers/governance.py) |
| **"Prepare My Day" Killer Feature** | Morning scan across 20 clients ranking 🔴 Critical, 🟡 Review, and 🟢 On-Track priorities. | [`backend/app/routers/advisor.py`](file:///Users/amitraj/job_Related_project_2026/Wealth_n_Asset_Management/backend/app/routers/advisor.py) |

---

## 🎤 3. Top 5 Interview Questions & Exact Answers

### Q1: "Why did you use MCP (Model Context Protocol) instead of standard OpenAI function calling?"
> **Answer**:  
> *"MCP provides a standardized, interoperable protocol for tool discovery and execution. In financial enterprise environments, tool definitions need to be decoupled from specific model providers so that a firm can swap between Anthropic Claude, OpenAI, or local fine-tuned models without rewriting business logic."*

---

### Q2: "How do you prevent the AI from hallucinating stock prices or returns?"
> **Answer**:  
> *"The LLM is never allowed to guess numbers. In [`backend/app/mcp/tools.py`](file:///Users/amitraj/job_Related_project_2026/Wealth_n_Asset_Management/backend/app/mcp/tools.py), deterministic Python functions compute exact figures (e.g. `calculate_asset_allocation` and `get_market_data` from Dhan). The LLM's role is strictly reasoning, summarization, and drafting discussion points on top of verified figures."*

---

### Q3: "What happens when the AI detects a portfolio deviation?"
> **Answer**:  
> *"When the AI detects that a client like Rajesh Kumar has 78% equity vs his 65% target mandate, it executes `calculate_asset_allocation`. Because fixing it requires trading, the action is intercepted by **Policy 1 (Prohibit Autonomous Trading)**. The system automatically creates a `PendingApproval` record in the advisor's queue. A human advisor must click 'Authorize' before any trade instruction can be dispatched."*

---

### Q4: "How does your data validation pipeline work?"
> **Answer**:  
> *"I built a Pydantic normalization layer in [`backend/app/connectors/validation.py`](file:///Users/amitraj/job_Related_project_2026/Wealth_n_Asset_Management/backend/app/connectors/validation.py). External APIs from custodians or market feeds often return noisy or inconsistent schemas. Pydantic validates types, bounds check percentages (0-100%), and rejects corrupted payloads before they ever touch the database."*

---

### Q5: "How did you structure the frontend for wealth advisors?"
> **Answer**:  
> *"I built a responsive, light-themed React dashboard centered around Raj-AI's 'Prepare My Day' workflow. It gives the advisor immediate visibility into their total AUM, active alerts, priority client drift tiers, and a Client 360 view with real-time holdings and goals tracking."*

---

## 🚀 4. How to Run the 2-Minute Live Demo

1. **Start the app**:
   ```bash
   ./start.sh
   ```
2. **Open browser**: `http://127.0.0.1:5173/`
3. **Demo Sequence**:
   - **Click 1**: Click **"Prepare My Day"** in the top navbar ➔ Show the 3 priority tiers and live NIFTY/VIX indicators.
   - **Click 2**: Click **"Generate Brief"** on Rajesh Kumar ➔ Show the real-time MCP tool execution trace and executive meeting brief.
   - **Click 3**: Navigate to **"Governance & Approvals"** ➔ Click **"Review & Decide"** on the rebalancing proposal ➔ Click **"Authorize & Execute"**.
   - **Click 4**: Show the **"Immutable AI Activity Log"** tab displaying the audited timestamp and reviewer ID.
