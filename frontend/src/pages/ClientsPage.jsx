import React, { useState, useEffect } from 'react';
import { Search, Sparkles, User, RefreshCw } from 'lucide-react';
import { fetchClients } from '../services/api';
import { formatCurrencyINR, formatPct } from '../utils/formatters';

export default function ClientsPage({ onSelectClient, onOpenChatWithQuery }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    loadClients();
  }, [search, riskFilter, priorityFilter]);

  async function loadClients() {
    setLoading(true);
    try {
      const data = await fetchClients({
        search,
        risk_profile: riskFilter,
        priority: priorityFilter
      });
      setClients(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Portfolio & Client Hub
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
            Managing <strong>20 High-Net-Worth Portfolios</strong> • Unified from CRM & Dhan Live Feeds
          </p>
        </div>

        <button 
          onClick={loadClients}
          className="btn btn-secondary btn-sm btn-pill"
          title="Reload Client Accounts"
        >
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar (Finexa style from ui2.jpeg) */}
      <div className="card-white" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by client name, code (e.g. CL-101), or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '38px', borderRadius: 'var(--radius-full)' }}
            />
          </div>

          {/* Risk Profile Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="input-field"
            style={{ width: '170px', borderRadius: 'var(--radius-full)' }}
          >
            <option value="">All Risk Profiles</option>
            <option value="Conservative">Conservative</option>
            <option value="Moderate">Moderate</option>
            <option value="Aggressive">Aggressive</option>
          </select>

          {/* Priority Tier Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input-field"
            style={{ width: '170px', borderRadius: 'var(--radius-full)' }}
          >
            <option value="">All Priorities</option>
            <option value="CRITICAL">🔴 Critical Attention</option>
            <option value="REVIEW">🟡 Worth Reviewing</option>
            <option value="STABLE">🟢 Stable / Aligned</option>
          </select>

          {(search || riskFilter || priorityFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setRiskFilter('');
                setPriorityFilter('');
              }}
              className="btn btn-secondary btn-sm btn-pill"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Clients Table (Matching ui2.jpeg Account Performance table) */}
      <div className="card-white" style={{ padding: '20px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Client Profile</th>
                <th>City / Risk</th>
                <th>Portfolio AUM</th>
                <th>Equity (Actual vs Target)</th>
                <th>30D Return</th>
                <th>Governance Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Loading 20 client accounts...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No client accounts match your query.
                  </td>
                </tr>
              ) : (
                clients.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'var(--brand-violet-light)',
                          color: 'var(--brand-violet)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '13px'
                        }}>
                          {c.full_name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{c.full_name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.client_code} • {c.email}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: 600 }}>{c.city}</div>
                      <span className="badge badge-violet" style={{ fontSize: '10px', marginTop: '2px' }}>
                        {c.risk_profile}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 800, fontSize: '14.5px', color: 'var(--text-primary)' }}>
                        {formatCurrencyINR(c.total_portfolio_value)}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px' }}>{c.equity_pct}%</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(Target: {c.target_equity_pct}%)</span>
                        <span className={`badge ${Math.abs(c.equity_deviation) >= 10 ? 'badge-critical' : (Math.abs(c.equity_deviation) >= 5 ? 'badge-review' : 'badge-stable')}`} style={{ fontSize: '10px' }}>
                          {c.equity_deviation > 0 ? '+' : ''}{c.equity_deviation}%
                        </span>
                      </div>
                    </td>

                    <td>
                      <span style={{
                        fontWeight: 700,
                        color: c.return_30d_pct >= 0 ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {formatPct(c.return_30d_pct)}
                      </span>
                    </td>

                    <td>
                      <span className={`badge ${c.priority_flag === 'CRITICAL' ? 'badge-critical' : (c.priority_flag === 'REVIEW' ? 'badge-review' : 'badge-stable')}`}>
                        {c.priority_flag === 'CRITICAL' ? '🔴 Critical' : (c.priority_flag === 'REVIEW' ? '🟡 Review' : '🟢 Aligned')}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => onSelectClient(c.id)}
                          className="btn btn-secondary btn-sm btn-pill"
                        >
                          <User size={13} />
                          <span>360</span>
                        </button>

                        <button
                          onClick={() => onOpenChatWithQuery(`Prepare me for tomorrow's meeting with ${c.full_name}. Analyze portfolio drift and generate meeting brief.`)}
                          className="btn btn-primary btn-sm btn-pill"
                        >
                          <Sparkles size={12} />
                          <span>Brief</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
