from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from typing import List, Dict, Any, Optional
from datetime import datetime

from backend.app.database import get_db
from backend.app.models.audit import AiAuditLog
from backend.app.models.approval import PendingApproval
from backend.app.models.client import Client
from backend.app.schemas.governance import AuditLogResponse, PendingApprovalResponse, ApprovalActionRequest
from backend.app.governance.policy_engine import policy_engine

router = APIRouter(prefix="/governance", tags=["Governance, Policies & Audit Trail"])

@router.get("/audit-logs", response_model=List[AuditLogResponse])
async def list_audit_logs(
    client_id: Optional[int] = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve immutable AI audit logs with execution metadata and policy evaluation results"""
    query = select(AiAuditLog).options(selectinload(AiAuditLog.client)).order_by(AiAuditLog.timestamp.desc()).limit(limit)
    if client_id:
        query = query.where(AiAuditLog.client_id == client_id)

    result = await db.execute(query)
    logs = result.scalars().all()

    response = []
    for l in logs:
        response.append(AuditLogResponse(
            id=l.id,
            timestamp=l.timestamp,
            user_id=l.user_id,
            client_id=l.client_id,
            client_name=l.client.full_name if l.client else "System Wide",
            agent_name=l.agent_name,
            action=l.action,
            tool_used=l.tool_used,
            input_params=l.input_params,
            output_summary=l.output_summary,
            policy_result=l.policy_result,
            policy_details=l.policy_details,
            human_approval_status=l.human_approval_status,
            human_reviewer_id=l.human_reviewer_id,
            review_notes=l.review_notes,
            reviewed_at=l.reviewed_at
        ))
    return response

@router.get("/pending-approvals", response_model=List[PendingApprovalResponse])
async def list_pending_approvals(
    status: Optional[str] = "PENDING",
    db: AsyncSession = Depends(get_db)
):
    """List pending AI-recommended actions requiring human advisor sign-off"""
    query = select(PendingApproval).options(selectinload(PendingApproval.client)).order_by(PendingApproval.created_at.desc())
    if status and status.upper() != "ALL":
        query = query.where(PendingApproval.status == status.upper())

    result = await db.execute(query)
    approvals = result.scalars().all()

    response = []
    for a in approvals:
        response.append(PendingApprovalResponse(
            id=a.id,
            client_id=a.client_id,
            client_name=a.client.full_name if a.client else "Client",
            action_type=a.action_type,
            title=a.title,
            description=a.description,
            proposed_payload=a.proposed_payload,
            ai_reasoning=a.ai_reasoning,
            policy_violation_reasons=a.policy_violation_reasons,
            urgency=a.urgency,
            status=a.status,
            created_at=a.created_at,
            reviewed_at=a.reviewed_at,
            reviewed_by=a.reviewed_by,
            advisor_notes=a.advisor_notes
        ))
    return response

@router.post("/approvals/{approval_id}/action")
async def execute_approval_decision(
    approval_id: int,
    action: ApprovalActionRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Advisor decision on pending AI action:
    APPROVE: Authorizes and logs the action.
    REJECT: Declines the action with advisor reasoning.
    MODIFY: Updates parameters before execution.
    """
    res = await db.execute(select(PendingApproval).where(PendingApproval.id == approval_id))
    approval = res.scalar_one_or_none()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")

    decision = action.decision.upper()
    if decision not in ["APPROVE", "REJECT", "MODIFY"]:
        raise HTTPException(status_code=400, detail="Decision must be APPROVE, REJECT, or MODIFY")

    approval.status = "APPROVED" if decision == "APPROVE" else ("REJECTED" if decision == "REJECT" else "MODIFIED")
    approval.reviewed_by = action.reviewer_id
    approval.advisor_notes = action.notes
    approval.reviewed_at = datetime.utcnow()
    if action.modified_payload:
        approval.proposed_payload = action.modified_payload

    # Record in Audit Log
    audit_entry = AiAuditLog(
        timestamp=datetime.utcnow(),
        user_id=action.reviewer_id,
        client_id=approval.client_id,
        agent_name="Human Advisor Review",
        action=f"APPROVAL_{decision}",
        tool_used="Human-in-the-Loop Workflow",
        input_params={"approval_id": approval_id, "action_type": approval.action_type},
        output_summary=f"Advisor {action.reviewer_id} {decision.lower()}d '{approval.title}'. Notes: {action.notes or 'None'}",
        policy_result="PASSED_HUMAN_OVERRIDE",
        policy_details=f"Human authorization completed for {approval.action_type}",
        human_approval_status=approval.status,
        human_reviewer_id=action.reviewer_id,
        review_notes=action.notes,
        reviewed_at=datetime.utcnow()
    )
    db.add(audit_entry)
    await db.commit()

    return {
        "status": "SUCCESS",
        "approval_id": approval_id,
        "new_status": approval.status,
        "reviewed_by": action.reviewer_id,
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/policies")
async def get_governance_policies():
    """Retrieve all active enterprise governance policies"""
    return {
        "framework": "FinAdvisor AI Enterprise Governance Framework v3.0",
        "enforcement_mode": "STRICT_BLOCK_AND_FLAG",
        "policies": policy_engine.POLICIES
    }
