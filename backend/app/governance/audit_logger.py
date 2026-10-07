import logging
from typing import Dict, Any, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.audit import AiAuditLog
from backend.app.models.approval import PendingApproval

logger = logging.getLogger("FinAdvisor.AuditLogger")

class GovernanceAuditLogger:
    """
    Governance Audit Logger:
    Logs every agent action, tool invocation, input/output trace, and policy validation result.
    Creates pending approvals whenever an action requires human sign-off.
    """
    async def log_event(
        self,
        db: AsyncSession,
        action: str,
        user_id: str = "advisor_main",
        client_id: Optional[int] = None,
        agent_name: str = "FinAdvisor AI Engine",
        tool_used: Optional[str] = None,
        input_params: Optional[Dict[str, Any]] = None,
        output_summary: Optional[str] = None,
        policy_result: str = "PASSED",
        policy_details: Optional[str] = None,
        human_approval_status: str = "NOT_REQUIRED"
    ) -> AiAuditLog:
        try:
            audit_entry = AiAuditLog(
                timestamp=datetime.utcnow(),
                user_id=user_id,
                client_id=client_id,
                agent_name=agent_name,
                action=action,
                tool_used=tool_used,
                input_params=input_params,
                output_summary=output_summary[:1000] if output_summary else None,
                policy_result=policy_result,
                policy_details=policy_details,
                human_approval_status=human_approval_status
            )
            db.add(audit_entry)
            await db.commit()
            await db.refresh(audit_entry)
            return audit_entry
        except Exception as e:
            logger.error(f"Failed to record audit log: {e}")
            await db.rollback()
            raise e

    async def create_pending_approval(
        self,
        db: AsyncSession,
        client_id: int,
        action_type: str,
        title: str,
        description: str,
        proposed_payload: Optional[Dict[str, Any]] = None,
        ai_reasoning: Optional[str] = None,
        policy_violation_reasons: Optional[str] = None,
        urgency: str = "Medium"
    ) -> PendingApproval:
        try:
            approval = PendingApproval(
                client_id=client_id,
                action_type=action_type,
                title=title,
                description=description,
                proposed_payload=proposed_payload,
                ai_reasoning=ai_reasoning,
                policy_violation_reasons=policy_violation_reasons,
                urgency=urgency,
                status="PENDING",
                created_at=datetime.utcnow()
            )
            db.add(approval)
            await db.commit()
            await db.refresh(approval)
            return approval
        except Exception as e:
            logger.error(f"Failed to create pending approval: {e}")
            await db.rollback()
            raise e

audit_logger = GovernanceAuditLogger()
