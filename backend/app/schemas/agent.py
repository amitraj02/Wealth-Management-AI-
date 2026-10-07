from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime

class ToolExecutionStep(BaseModel):
    step_num: int
    tool_name: str
    tool_input: Dict[str, Any]
    tool_output: Any
    latency_ms: float
    status: str = "SUCCESS"

class AgentChatRequest(BaseModel):
    query: str
    client_id: Optional[int] = None
    session_id: Optional[str] = "default_session"
    enforce_governance: bool = True

class AgentChatResponse(BaseModel):
    query: str
    client_id: Optional[int] = None
    answer: str
    meeting_brief: Optional[str] = None
    recommended_action: Optional[str] = None
    action_type: Optional[str] = None
    requires_approval: bool = False
    approval_id: Optional[int] = None
    policy_checks: List[Dict[str, Any]] = []
    tools_executed: List[ToolExecutionStep] = []
    sources: List[str] = []
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PrepareMyDayResponse(BaseModel):
    date: str
    total_clients_scanned: int
    critical_count: int
    review_count: int
    stable_count: int
    critical_clients: List[Dict[str, Any]]
    review_clients: List[Dict[str, Any]]
    stable_clients: List[Dict[str, Any]]
    market_overview: Dict[str, Any]
    ai_advisor_briefing: str
    suggested_actions: List[Dict[str, Any]]
