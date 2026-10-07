import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { fetchClient360 } from '../services/api';
import { formatCurrencyINR, formatPct, formatDate } from '../utils/formatters';

export default function Client360Modal({ clientId, isOpen, onClose, onOpenAgentWithPrompt }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('holdings');

  useEffect(() => {
    if (clientId && isOpen) {
      setLoading(true);
      fetchClient360(clientId)
        .then(res => {
          setData(res);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [clientId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '1050px', height: '88vh' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 28px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {loading ? (
            <div style={{ fontSize: '15px', color: 'var(--text-muted)' }}>Loading Client 360 profile...</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '18px'
              }}>
                {data.client.full_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {data.client.full_name}
                  </h2>
                  <span className="badge badge-blue">{data.client.client_code}</span>
                  <span className="badge badge-purple">{data.client.risk_profile} Risk</span>
                  <span className="badge badge-stable">{data.client.kyc_status}</span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {data.client.email} • {data.client.phone} • {data.client.city} • Age {data.client.age}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {data && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAgentWithPrompt(`Prepare me for tomorrow's meeting with ${data.client.full_name}. Analyze portfolio drift and generate executive brief.`);
                }}
                className="btn btn-primary btn-sm"
              >
                <Sparkles size={14} />
                <span>AI Meeting Brief</span>
              </button>
            )}
            <button 
              onClick={onClose}
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {loading || !data ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Retrieving unified financial model across Custody & Market databases...
          </div>
        ) : (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left Sidebar Info */}
            <div style={{
              width: '290px',
              background: 'var(--bg-subtle)',
              borderRight: '1px solid var(--border-light)',
              padding: '24px 20px',
              overflowY: 'auto'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Total Portfolio Value
                </span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {formatCurrencyINR(data.portfolio.total_value)}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                    30D: {formatPct(data.portfolio.return_30d_pct)}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    1Y: {formatPct(data.portfolio.return_1y_pct)}
                  </span>
                </div>
              </div>

              {/* Asset Allocation Breakdown */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Asset Allocation vs Target
                </div>
                
                {/* Equity */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                    <span>Equity: <strong>{data.portfolio.equity_pct}%</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>Target: {data.client.target_equity_pct}%</span>
                  </div>
                  <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, data.portfolio.equity_pct)}%`,
                      background: data.portfolio.equity_pct > data.client.target_equity_pct + 5 ? 'var(--danger)' : '#2563eb',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>

                {/* Debt */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                    <span>Debt: <strong>{data.portfolio.debt_pct}%</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>Target: {data.client.target_debt_pct}%</span>
                  </div>
                  <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, data.portfolio.debt_pct)}%`,
                      background: '#10b981',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>

                {/* Cash */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                    <span>Cash: <strong>{data.portfolio.cash_pct}%</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>Target: {data.client.target_cash_pct}%</span>
                  </div>
                  <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, data.portfolio.cash_pct)}%`,
                      background: '#f59e0b',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
              </div>

              {/* Advisor Notes Box */}
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                fontSize: '12px'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Advisor CRM Mandate
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {data.client.advisor_notes || "Standard wealth management mandate."}
                </p>
              </div>
            </div>

            {/* Right Main Content Tabs */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Navigation Tabs */}
              <div style={{
                padding: '12px 24px',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={() => setActiveTab('holdings')}
                  className={`pill-item ${activeTab === 'holdings' ? 'active' : ''}`}
                >
                  Holdings ({data.portfolio.holdings?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('goals')}
                  className={`pill-item ${activeTab === 'goals' ? 'active' : ''}`}
                >
                  Goals Tracker ({data.goals?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`pill-item ${activeTab === 'transactions' ? 'active' : ''}`}
                >
                  Recent Transactions ({data.recent_transactions?.length || 0})
                </button>
              </div>

              {/* Tab Panels */}
              <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                {activeTab === 'holdings' && (
                  <div>
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Instrument</th>
                          <th>Sector / Class</th>
                          <th>Qty</th>
                          <th>Avg Buy</th>
                          <th>Current (Dhan)</th>
                          <th>Market Value</th>
                          <th>Unrealized P&L</th>
                          <th>Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.portfolio.holdings.map((h) => (
                          <tr key={h.id}>
                            <td>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{h.symbol}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{h.name}</div>
                            </td>
                            <td>
                              <span className="badge badge-blue" style={{ fontSize: '11px' }}>{h.asset_class}</span>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{h.sector}</div>
                            </td>
                            <td>{h.quantity}</td>
                            <td>₹{h.avg_buy_price.toLocaleString('en-IN')}</td>
                            <td style={{ fontWeight: 600 }}>₹{h.current_price.toLocaleString('en-IN')}</td>
                            <td style={{ fontWeight: 700 }}>{formatCurrencyINR(h.market_value)}</td>
                            <td style={{
                              fontWeight: 700,
                              color: h.unrealized_pnl_pct >= 0 ? 'var(--success)' : 'var(--danger)'
                            }}>
                              {formatPct(h.unrealized_pnl_pct)}
                            </td>
                            <td style={{ fontWeight: 600 }}>{h.weight_pct}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'goals' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                    {data.goals.map((g) => (
                      <div key={g.id} className="card" style={{ padding: '18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <div>
                            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{g.goal_name}</h4>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target Year: {g.target_year}</span>
                          </div>
                          <span className={`badge ${g.on_track ? 'badge-stable' : 'badge-critical'}`}>
                            {g.on_track ? '✓ On Track' : '⚠️ Off Track'}
                          </span>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span>Accumulated: <strong>{formatCurrencyINR(g.current_amount)}</strong></span>
                            <span>Target: <strong>{formatCurrencyINR(g.target_amount)}</strong></span>
                          </div>
                          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${Math.min(100, g.progress_pct)}%`,
                              background: g.on_track ? 'var(--success)' : 'var(--danger)',
                              borderRadius: '4px'
                            }} />
                          </div>
                        </div>

                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Required Monthly SIP: <strong>{formatCurrencyINR(g.required_monthly_sip)}/mo</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'transactions' && (
                  <div>
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Reference</th>
                          <th>Type</th>
                          <th>Instrument</th>
                          <th>Qty</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recent_transactions.map((t) => (
                          <tr key={t.id}>
                            <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(t.timestamp)}</td>
                            <td className="font-mono" style={{ fontSize: '12px' }}>{t.txn_ref}</td>
                            <td>
                              <span className={`badge ${t.txn_type === 'BUY' ? 'badge-stable' : (t.txn_type === 'SELL' ? 'badge-critical' : 'badge-blue')}`}>
                                {t.txn_type}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700 }}>{t.symbol}</td>
                            <td>{t.quantity}</td>
                            <td style={{ fontWeight: 700 }}>{formatCurrencyINR(t.total_amount)}</td>
                            <td>
                              <span className="badge badge-stable" style={{ fontSize: '11px' }}>{t.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
