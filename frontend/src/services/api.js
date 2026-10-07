const API_BASE = "http://127.0.0.1:8000/api/v1";

export async function fetchAdvisorStats() {
  const res = await fetch(`${API_BASE}/advisor/stats`);
  if (!res.ok) throw new Error("Failed to fetch advisor stats");
  return res.json();
}

export async function fetchPrepareMyDay() {
  const res = await fetch(`${API_BASE}/advisor/prepare-my-day`);
  if (!res.ok) throw new Error("Failed to run Prepare My Day scan");
  return res.json();
}

export async function fetchClients(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.append("search", params.search);
  if (params.risk_profile) searchParams.append("risk_profile", params.risk_profile);
  if (params.priority) searchParams.append("priority", params.priority);
  
  const res = await fetch(`${API_BASE}/clients?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch clients");
  return res.json();
}

export async function fetchClient360(clientId) {
  const res = await fetch(`${API_BASE}/clients/${clientId}`);
  if (!res.ok) throw new Error(`Failed to fetch client 360 for ID ${clientId}`);
  return res.json();
}

export async function sendAgentChat(query, clientId = null, enforceGovernance = true) {
  const res = await fetch(`${API_BASE}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      client_id: clientId,
      enforce_governance: enforceGovernance
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Agent chat query failed");
  }
  return res.json();
}

export async function generateMeetingBrief(clientId) {
  const res = await fetch(`${API_BASE}/agent/generate-brief/${clientId}`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to generate meeting brief");
  return res.json();
}

export async function fetchAuditLogs(clientId = null) {
  const url = clientId ? `${API_BASE}/governance/audit-logs?client_id=${clientId}` : `${API_BASE}/governance/audit-logs`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
}

export async function fetchPendingApprovals(status = "PENDING") {
  const res = await fetch(`${API_BASE}/governance/pending-approvals?status=${status}`);
  if (!res.ok) throw new Error("Failed to fetch pending approvals");
  return res.json();
}

export async function submitApprovalAction(approvalId, decision, notes = "", modifiedPayload = null) {
  const res = await fetch(`${API_BASE}/governance/approvals/${approvalId}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      decision,
      reviewer_id: "Advisor_Amit_Raj",
      notes,
      modified_payload: modifiedPayload
    })
  });
  if (!res.ok) throw new Error("Failed to process approval action");
  return res.json();
}

export async function fetchIntegrationsStatus() {
  const res = await fetch(`${API_BASE}/integrations/status`);
  if (!res.ok) throw new Error("Failed to fetch integration status");
  return res.json();
}

export async function fetchMarketQuotes() {
  const res = await fetch(`${API_BASE}/integrations/market-quotes`);
  if (!res.ok) throw new Error("Failed to fetch market quotes");
  return res.json();
}

export async function triggerSync() {
  const res = await fetch(`${API_BASE}/integrations/sync`, { method: "POST" });
  if (!res.ok) throw new Error("Sync failed");
  return res.json();
}

export async function fetchMCPTools() {
  const res = await fetch(`${API_BASE}/agent/mcp-tools`);
  if (!res.ok) throw new Error("Failed to fetch MCP tools");
  return res.json();
}
