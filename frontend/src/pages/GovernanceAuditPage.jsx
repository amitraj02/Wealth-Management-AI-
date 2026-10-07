import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import { fetchPendingApprovals, fetchAuditLogs } from '../services/api';
import ApprovalActionModal from '../components/ApprovalActionModal';
import { formatDate } from '../utils/formatters';

export default function GovernanceAuditPage() {
  const [activeTab, setActiveTab] = useState('approvals');
  const [approvals, setApprovals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === 'approvals') {
        const data = await fetchPendingApprovals('ALL');
        setApprovals(data);
      } else {
        const logs = await fetchAuditLogs();
        setAuditLogs(logs);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  const policies = [
    { id: 'P1', title: 'Policy 1: Prohibit Autonomous Trading', desc: 'AI cannot execute market orders or depository rebalances directly without certified advisor approval.', status: 'ENFORCED' },
    { id: 'P2', title: 'Policy 2: Financial Records Integrity', desc: 'AI cannot alter client bank account balances, cash positions, or KYC statuses.', status: 'ENFORCED' },
    { id: 'P3', title: 'Policy 3: Outbound Communication Gatekeeper', desc: 'All client emails, SMS briefs, or reports must be authorized by the advisor prior to dispatch.', status: 'ENFORCED' },
    { id: 'P4', title: 'Policy 4: Sensitive Data & PII Masking', desc: 'PAN numbers, depository account IDs, and Aadhaar numbers are masked in all generated text.', status: 'ENFORCED' },
    { id: 'P5', title: 'Policy 5: Mandatory Audit Traceability', desc: 'Every tool invocation, user query, latency metric, and policy result is immutably logged.', status: 'ENFORCED' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Governance, Policies & Audit Trail
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
            Institutional Human-in-the-Loop oversight • Zero Autonomous Execution
          </p>
        </div>

        <button onClick={loadData} className="btn btn-secondary btn-sm btn-pill">
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 5 Enterprise Policies Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {policies.map((p) => (
          <div key={p.id} className="card-white" style={{ padding: '18px', borderLeft: '4px solid var(--brand-violet)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-violet)' }}>{p.id}</span>
              <span className="badge badge-stable" style={{ fontSize: '10px' }}>
                <ShieldCheck size={11} />
                {p.status}
              </span>
            </div>
            <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {p.title}
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              {p.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Main Tabs */}
      <div className="card-white">
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`btn btn-sm ${activeTab === 'approvals' ? 'btn-primary' : 'btn-secondary'} btn-pill`}
          >
            Pending Approvals Queue ({approvals.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`btn btn-sm ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'} btn-pill`}
          >
            Immutable AI Activity Log ({auditLogs.length})
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {activeTab === 'approvals' && (
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading approvals...</div>
              ) : approvals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  ✓ All AI proposed actions have been reviewed. Queue is empty.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {approvals.map((a) => (
                    <div
                      key={a.id}
                      style={{
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '18px 20px',
                        background: a.status === 'PENDING' ? '#fffdf7' : 'var(--surface-white)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: 'var(--shadow-card)'
                      }}
                    >
                      <div style={{ maxWidth: '70%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span className={`badge ${a.status === 'PENDING' ? 'badge-review' : (a.status === 'APPROVED' ? 'badge-stable' : 'badge-critical')}`}>
                            {a.status}
                          </span>
                          <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {a.title}
                          </h4>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            for {a.client_name}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                          {a.description}
                        </p>
                        <div style={{ fontSize: '11.5px', color: 'var(--danger-text)', fontWeight: 600 }}>
                          🛑 {a.policy_violation_reasons || "Policy 1: AI cannot execute trades directly."}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {a.status === 'PENDING' ? (
                          <button
                            onClick={() => {
                              setSelectedApproval(a);
                              setIsModalOpen(true);
                            }}
                            className="btn btn-primary btn-sm btn-pill"
                          >
                            <ShieldAlert size={14} />
                            <span>Review & Decide</span>
                          </button>
                        ) : (
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>
                            <div>Reviewed by {a.reviewed_by}</div>
                            <div>{formatDate(a.reviewed_at)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'audit' && (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User / Agent</th>
                    <th>Client</th>
                    <th>Action</th>
                    <th>Tool Trace</th>
                    <th>Policy Evaluation</th>
                    <th>Human Approval</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {formatDate(log.timestamp)}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '12.5px' }}>{log.agent_name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>User: {log.user_id}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{log.client_name}</div>
                      </td>
                      <td>
                        <span className="badge badge-violet" style={{ fontSize: '10.5px' }}>
                          {log.action}
                        </span>
                      </td>
                      <td style={{ fontSize: '11.5px', color: 'var(--text-secondary)', maxWidth: '200px' }}>
                        {log.tool_used || "Direct Analytic Inference"}
                      </td>
                      <td>
                        <span className={`badge ${log.policy_result === 'PASSED' ? 'badge-stable' : (log.policy_result === 'REQUIRES_APPROVAL' ? 'badge-review' : 'badge-critical')}`} style={{ fontSize: '10.5px' }}>
                          {log.policy_result}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${log.human_approval_status === 'APPROVED' ? 'badge-stable' : (log.human_approval_status === 'PENDING' ? 'badge-review' : 'badge-violet')}`} style={{ fontSize: '10.5px' }}>
                          {log.human_approval_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Decision Modal */}
      <ApprovalActionModal
        approval={selectedApproval}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
