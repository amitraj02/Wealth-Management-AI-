from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, List

from backend.app.database import get_db
from backend.app.schemas.agent import AgentChatRequest, AgentChatResponse
from backend.app.agent.engine import governed_agent
from backend.app.mcp.server import mcp_server

router = APIRouter(prefix="/agent", tags=["AI Agent & MCP Tools"])

@router.post("/chat", response_model=AgentChatResponse)
async def chat_with_agent(
    request: AgentChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Invoke the Governed AI Agent with a natural language query.
    Executes MCP tools, applies policy engine compliance checks, and records audit trail.
    """
    try:
        response = await governed_agent.run_governed_query(
            db=db,
            query=request.query,
            client_id=request.client_id,
            enforce_governance=request.enforce_governance
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-brief/{client_id}", response_model=AgentChatResponse)
async def generate_client_meeting_brief(
    client_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Generate structured meeting brief for a specific client"""
    query = f"Prepare me for tomorrow's meeting with client ID {client_id}. Analyze portfolio, allocation drift and recommended discussion points."
    return await governed_agent.run_governed_query(db=db, query=query, client_id=client_id)

@router.get("/mcp-tools")
async def list_registered_mcp_tools():
    """Discover available MCP tools and parameter schemas"""
    return {
        "status": "ACTIVE",
        "mcp_server": "FinAdvisor-MCP-Core v2.4",
        "tools_count": len(mcp_server.list_tools()),
        "tools": mcp_server.list_tools()
    }
