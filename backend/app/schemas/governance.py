from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime

class AuditLogResponse(BaseModel):
    id: int
    timestamp: datetime
    user_id: str
    client_id: Optional[int] = None
    client_name: Optional[str] = None
    agent_name: str
    action: str
    tool_used: Optional[str] = None
    input_params: Optional[Dict[str, Any]] = None
    output_summary: Optional[str] = None
    policy_result: str
    policy_details: Optional[str] = None
    human_approval_status: str
    human_reviewer_id: Optional[str] = None
    review_notes: Optional[str] = None
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PendingApprovalResponse(BaseModel):
    id: int
    client_id: int
    client_name: Optional[str] = None
    action_type: str
    title: str
    description: str
    proposed_payload: Optional[Dict[str, Any]] = None
    ai_reasoning: Optional[str] = None
    policy_violation_reasons: Optional[str] = None
    urgency: str
    status: str
    created_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[str] = None
    advisor_notes: Optional[str] = None

    class Config:
        from_attributes = True

class ApprovalActionRequest(BaseModel):
    decision: str # "APPROVE", "REJECT", "MODIFY"
    reviewer_id: str = "Advisor_Amit"
    notes: Optional[str] = None
    modified_payload: Optional[Dict[str, Any]] = None

class PolicyEvaluationResult(BaseModel):
    action_type: str
    is_allowed: bool
    requires_human_approval: bool
    policy_name: str
    reason: str
    suggested_review_flow: Optional[str] = None
