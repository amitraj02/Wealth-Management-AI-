import React, { useState } from 'react';
import { X, ShieldAlert, Check, Ban, AlertCircle } from 'lucide-react';
import { submitApprovalAction } from '../services/api';

export default function ApprovalActionModal({ approval, isOpen, onClose, onSuccess }) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !approval) return null;

  async function handleDecision(decision) {
    setLoading(true);
    try {
      await submitApprovalAction(approval.id, decision, notes);
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(`Action failed: ${err.message}`);
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'var(--warning-bg)',
              color: 'var(--warning-text)',
              border: '1px solid var(--warning-border)',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldAlert size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Advisor Approval Required
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Action ID: #{approval.id} • {approval.action_type}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {approval.title}
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {approval.description}
            </p>
          </div>

          {/* AI Reasoning & Policy Trigger */}
          <div style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              <AlertCircle size={14} color="var(--brand-primary)" />
              <span>Governance Policy Trigger</span>
            </div>
            <p style={{ color: 'var(--danger-text)', fontWeight: 600, marginBottom: '6px' }}>
              {approval.policy_violation_reasons || "Policy 1: AI cannot execute trades directly"}
            </p>
            <div style={{ color: 'var(--text-secondary)' }}>
              <strong>AI Rationale:</strong> {approval.ai_reasoning}
            </div>
          </div>

          {/* Proposed Payload if present */}
          {approval.proposed_payload && (
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Proposed Parameters
              </span>
              <pre className="font-mono" style={{
                background: '#1e293b',
                color: '#f8fafc',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                marginTop: '4px',
                overflowX: 'auto',
                maxHeight: '140px'
              }}>
                {JSON.stringify(approval.proposed_payload, null, 2)}
              </pre>
            </div>
          )}

          {/* Advisor Review Notes Input */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Advisor Review Notes (Logged to immutable audit table)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified with client during morning call. Approved rebalancing to mitigate tech sector concentration."
              rows={3}
              className="input-field"
              style={{ resize: 'none' }}
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div style={{
          padding: '16px 24px',
          background: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => handleDecision('REJECT')}
            disabled={loading}
            className="btn btn-danger btn-sm"
          >
            <Ban size={14} />
            <span>Reject Proposal</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onClose} className="btn btn-secondary btn-sm" disabled={loading}>
              Cancel
            </button>
            <button
              onClick={() => handleDecision('APPROVE')}
              disabled={loading}
              className="btn btn-success btn-sm"
            >
              <Check size={14} />
              <span>Authorize & Execute</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
