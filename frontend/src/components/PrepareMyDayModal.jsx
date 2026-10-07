import React, { useState } from 'react';
import { Sparkles, X, AlertTriangle, CheckCircle, Clock, User } from 'lucide-react';

export default function PrepareMyDayModal({ isOpen, onClose, data, onSelectClient, onOpenChatWithQuery }) {
  const [activeTab, setActiveTab] = useState('critical');

  if (!isOpen || !data) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>FinAdvisor AI — Prepare My Day</h2>
              <p style={{ fontSize: '12px', opacity: 0.85 }}>
                {data.date} • Scanned {data.total_clients_scanned} client portfolios & Dhan Market Feeds
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Market Context Banner */}
        {data.market_overview && (
          <div style={{
            background: '#f8fafc',
            borderBottom: '1px solid var(--border-light)',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>LIVE MARKET:</span>
              <span>
                <strong>NIFTY 50:</strong> {data.market_overview.nifty_50?.current} ({data.market_overview.nifty_50?.change_pct > 0 ? '+' : ''}{data.market_overview.nifty_50?.change_pct}%)
              </span>
              <span>
                <strong>SENSEX:</strong> {data.market_overview.sensex?.current}
              </span>
              <span>
                <strong>INDIA VIX:</strong> {data.market_overview.india_vix?.current}
              </span>
            </div>
            <span className="badge badge-stable" style={{ fontSize: '11px' }}>
              Optimal Rebalancing Window
            </span>
          </div>
        )}

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(85vh - 140px)' }}>
          {/* Priority Breakdown Tabs */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              onClick={() => setActiveTab('critical')}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: 'var(--radius-lg)',
                border: activeTab === 'critical' ? '2px solid var(--danger)' : '1px solid var(--border-light)',
                background: activeTab === 'critical' ? 'var(--danger-bg)' : 'var(--bg-surface)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger-text)', fontWeight: 700, fontSize: '14px' }}>
                  <AlertTriangle size={16} />
                  <span>🔴 Immediate Attention</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Allocation drift or pending approval
                </div>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--danger-text)' }}>
                {data.critical_count}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('review')}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: 'var(--radius-lg)',
                border: activeTab === 'review' ? '2px solid var(--warning)' : '1px solid var(--border-light)',
                background: activeTab === 'review' ? 'var(--warning-bg)' : 'var(--bg-surface)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--warning-text)', fontWeight: 700, fontSize: '14px' }}>
                  <Clock size={16} />
                  <span>🟡 Worth Reviewing</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Moderate drift or high volatility
                </div>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--warning-text)' }}>
                {data.review_count}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('stable')}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: 'var(--radius-lg)',
                border: activeTab === 'stable' ? '2px solid var(--success)' : '1px solid var(--border-light)',
                background: activeTab === 'stable' ? 'var(--success-bg)' : 'var(--bg-surface)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success-text)', fontWeight: 700, fontSize: '14px' }}>
                  <CheckCircle size={16} />
                  <span>🟢 On Track</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Mandates fully satisfied
                </div>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--success-text)' }}>
                {data.stable_count}
              </span>
            </button>
          </div>

          {/* Client List for Selected Tab */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(activeTab === 'critical' ? data.critical_clients : (activeTab === 'review' ? data.review_clients : data.stable_clients)).map((c) => (
              <div 
                key={c.client_id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: activeTab === 'critical' ? 'var(--danger-bg)' : (activeTab === 'review' ? 'var(--warning-bg)' : 'var(--success-bg)'),
                    color: activeTab === 'critical' ? 'var(--danger)' : (activeTab === 'review' ? 'var(--warning)' : 'var(--success)'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px'
                  }}>
                    {c.full_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--text-primary)' }}>
                        {c.full_name}
                      </span>
                      <span className="badge badge-blue" style={{ fontSize: '10px' }}>
                        {c.client_code}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        • ₹{c.portfolio_val_lakh}L AUM
                      </span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                      <strong>Issue:</strong> {c.issue}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectClient(c.client_id);
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    <User size={13} />
                    <span>View 360</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenChatWithQuery(`Prepare me for tomorrow's meeting with ${c.full_name}. Analyze portfolio drift and generate meeting brief.`);
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    <Sparkles size={13} />
                    <span>Generate Brief</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 24px',
          background: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Governance Policy 1 active: AI trade rebalances queued for human confirmation.
          </span>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close Briefing
          </button>
        </div>
      </div>
    </div>
  );
}
