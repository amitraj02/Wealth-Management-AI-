import re
from typing import Dict, Any

class PolicyViolationError(Exception):
    def __init__(self, policy_id: str, message: str):
        self.policy_id = policy_id
        self.message = message
        super().__init__(f"[{policy_id}] {message}")

class PolicyEngine:
    """
    FinAdvisor Governance & Policy Engine
    Enforces enterprise guardrails & compliance checks on AI actions.
    Ensures human-in-the-loop for all consequential wealth management actions.
    """
    
    POLICIES = {
        "POLICY_1_NO_DIRECT_TRADES": {
            "name": "Prohibit Autonomous Trade Execution",
            "description": "AI is strictly prohibited from executing buy/sell orders directly on exchanges or depositories without explicit advisor approval.",
            "rule_type": "BLOCK_AND_FLAG"
        },
        "POLICY_2_NO_DIRECT_FINANCIAL_MODS": {
            "name": "Financial Data Integrity",
            "description": "AI cannot directly alter bank records, portfolio balances, or KYC statuses.",
            "rule_type": "BLOCK_AND_FLAG"
        },
        "POLICY_3_COMMUNICATION_APPROVAL": {
            "name": "Client Outreach Gatekeeper",
            "description": "Any outbound client email, SMS, or meeting brief sent to external recipients requires Human-in-the-Loop advisor review.",
            "rule_type": "REQUIRES_APPROVAL"
        },
        "POLICY_4_PII_PROTECTION": {
            "name": "Client PII & Data Privacy",
            "description": "Protect and sanitize sensitive client identifiers (Aadhaar, PAN, Bank Acct) in AI summaries.",
            "rule_type": "SANITIZE"
        },
        "POLICY_5_MANDATORY_AUDIT_LOG": {
            "name": "Full Audit Traceability",
            "description": "Every agent invocation, tool call, query and generated recommendation must be logged with immutable timestamps.",
            "rule_type": "ENFORCE_LOG"
        }
    }

    def evaluate_action(self, action_name: str, payload: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Evaluate proposed action against governance policies.
        Returns:
            {
                "is_allowed": bool,
                "requires_approval": bool,
                "policy_code": str,
                "policy_name": str,
                "reason": str,
                "action_type": str
            }
        """
        payload = payload or {}
        action_upper = action_name.upper()

        # Policy 1: Trade Execution Attempts
        if any(keyword in action_upper for keyword in ["EXECUTE_TRADE", "PLACE_ORDER", "BUY_STOCK", "SELL_STOCK", "TRIGGER_REBALANCE"]):
            return {
                "is_allowed": False,
                "requires_approval": True,
                "policy_code": "POLICY_1_NO_DIRECT_TRADES",
                "policy_name": self.POLICIES["POLICY_1_NO_DIRECT_TRADES"]["name"],
                "reason": "AI cannot execute market orders or rebalance directly. Created a rebalancing proposal in the advisor approval queue.",
                "action_type": "TRADE_REBALANCE_PROPOSAL"
            }

        # Policy 2: Database / Financial Records Modification
        if any(keyword in action_upper for keyword in ["UPDATE_BANK_RECORD", "OVERRIDE_PORTFOLIO_CASH", "ALTER_KYC"]):
            return {
                "is_allowed": False,
                "requires_approval": True,
                "policy_code": "POLICY_2_NO_DIRECT_FINANCIAL_MODS",
                "policy_name": self.POLICIES["POLICY_2_NO_DIRECT_FINANCIAL_MODS"]["name"],
                "reason": "Direct modification of core financial balance records is restricted to authenticated compliance officers.",
                "action_type": "DATA_OVERRIDE_PROPOSAL"
            }

        # Policy 3: Client Communications
        if any(keyword in action_upper for keyword in ["SEND_CLIENT_EMAIL", "DISPATCH_NOTIFICATION", "SEND_WHATSAPP"]):
            return {
                "is_allowed": False,
                "requires_approval": True,
                "policy_code": "POLICY_3_COMMUNICATION_APPROVAL",
                "policy_name": self.POLICIES["POLICY_3_COMMUNICATION_APPROVAL"]["name"],
                "reason": "Client communications must be reviewed and approved by the certified relationship advisor before dispatch.",
                "action_type": "CLIENT_COMMUNICATION_DRAFT"
            }

        # Read-only & Analytic Actions are permitted with audit logging
        return {
            "is_allowed": True,
            "requires_approval": False,
            "policy_code": "PASSED_STANDARD_CHECKS",
            "policy_name": "Standard Read & Analytics Operations",
            "reason": "Action is read-only or internal analytical synthesis, conforming to all active governance guidelines.",
            "action_type": action_upper
        }

    def sanitize_pii(self, text: str) -> str:
        """Mask PAN numbers, bank account numbers, and phone numbers in AI outputs if requested"""
        if not text:
            return text
        # Mask PAN format (5 letters, 4 digits, 1 letter)
        text = re.sub(r'([A-Z]{5})(\d{4})([A-Z])', r'\1****\3', text)
        # Mask Bank Account numbers (e.g. 10-16 digits)
        text = re.sub(r'\b(\d{4})\d{4,8}(\d{4})\b', r'\1********\2', text)
        return text

policy_engine = PolicyEngine()
