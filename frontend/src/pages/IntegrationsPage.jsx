import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  ArrowRight 
} from 'lucide-react';
import { fetchIntegrationsStatus, fetchMarketQuotes, triggerSync } from '../services/api';
import { formatPct } from '../utils/formatters';

export default function IntegrationsPage() {
  const [status, setStatus] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [st, q] = await Promise.all([fetchIntegrationsStatus(), fetchMarketQuotes()]);
      setStatus(st);
      setQuotes(q);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      await triggerSync();
      await loadData();
      setSyncing(false);
      alert("✓ Data Integration Layer synchronized successfully across Dhan Market Feeds and Unified Database.");
    } catch (err) {
      console.error(err);
      setSyncing(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Financial Data Integration & Market Feeds
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
            High-throughput validation & Dhan market connector feeding the unified wealth model
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="btn btn-primary btn-sm btn-pill"
        >
          <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Synchronizing Feeds...' : 'Trigger Pipeline Sync'}</span>
        </button>
      </div>

      {/* Architecture Visualizer Card */}
      <div className="card-white" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Real-Time Data Pipeline Architecture
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          {/* Source 1 */}
          <div style={{
            background: 'var(--surface-white)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            flex: 1,
            minWidth: '170px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--text-muted)' }}>SOURCE 1</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              Dhan Market API
            </div>
            <span className="badge badge-stable" style={{ fontSize: '10px', marginTop: '6px' }}>Live Quotes</span>
          </div>

          <ArrowRight size={18} color="var(--text-muted)" />

          {/* Source 2 */}
          <div style={{
            background: 'var(--surface-white)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            flex: 1,
            minWidth: '170px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--text-muted)' }}>SOURCE 2</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              Client CRM API
            </div>
            <span className="badge badge-violet" style={{ fontSize: '10px', marginTop: '6px' }}>KYC / Mandates</span>
          </div>

          <ArrowRight size={18} color="var(--text-muted)" />

          {/* Source 3 */}
          <div style={{
            background: 'var(--surface-white)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            flex: 1,
            minWidth: '170px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--text-muted)' }}>SOURCE 3</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              NSDL / CDSL Custody
            </div>
            <span className="badge badge-violet" style={{ fontSize: '10px', marginTop: '6px' }}>Holdings & P&L</span>
          </div>

          <ArrowRight size={18} color="var(--text-muted)" />

          {/* Validation */}
          <div style={{
            background: '#ecfdf5',
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            flex: 1,
            minWidth: '170px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--success-text)' }}>NORMALIZATION</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--success-text)', marginTop: '2px' }}>
              Pydantic Validation
            </div>
            <span className="badge badge-stable" style={{ fontSize: '10px', marginTop: '6px' }}>99.98% Clean</span>
          </div>

          <ArrowRight size={18} color="var(--text-muted)" />

          {/* Unified Model */}
          <div style={{
            background: 'var(--brand-violet-light)',
            border: '1px solid #d8d4fa',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            flex: 1,
            minWidth: '170px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--brand-violet)' }}>CORE DATABASE</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-violet)', marginTop: '2px' }}>
              Unified Model
            </div>
            <span className="badge badge-violet" style={{ fontSize: '10px', marginTop: '6px' }}>AI Model Ready</span>
          </div>
        </div>
      </div>

      {/* Connectors Health Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {status?.connectors?.map((c, idx) => (
          <div key={idx} className="card-white" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge badge-stable" style={{ fontSize: '10.5px' }}>
                <CheckCircle size={12} />
                {c.status}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {c.latency_ms ? `${c.latency_ms}ms` : 'In-Memory'}
              </span>
            </div>

            <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {c.name}
            </h4>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {c.type}
            </div>
            <div className="font-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--surface-subtle)', padding: '5px 10px', borderRadius: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {c.endpoint || c.protocol}
            </div>
          </div>
        ))}
      </div>

      {/* Live Market Feed (Dhan Quotes) */}
      <div className="card-white" style={{ padding: '20px' }}>
        <div style={{ marginBottom: '14px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Live Market Universe (Dhan Feed & NSE Quotes)
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Real-time prices utilized by MCP tool get_market_data()
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ticker Symbol</th>
                <th>Company / Asset</th>
                <th>Class / Sector</th>
                <th>Current Price</th>
                <th>Day Change</th>
                <th>Day High / Low</th>
                <th>52W Range</th>
                <th>P/E Ratio</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id}>
                  <td style={{ fontWeight: 800, color: 'var(--brand-violet)' }}>{q.symbol}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{q.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{q.exchange}</div>
                  </td>
                  <td>
                    <span className="badge badge-violet" style={{ fontSize: '10.5px' }}>{q.asset_class}</span>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{q.sector}</div>
                  </td>
                  <td style={{ fontWeight: 800 }}>₹{q.current_price.toLocaleString('en-IN')}</td>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      color: q.change_pct >= 0 ? 'var(--success)' : 'var(--danger)'
                    }}>
                      {formatPct(q.change_pct)}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px' }}>₹{q.day_high} / ₹{q.day_low}</td>
                  <td style={{ fontSize: '12px' }}>₹{q.high_52w} / ₹{q.low_52w}</td>
                  <td style={{ fontWeight: 700 }}>{q.pe_ratio > 0 ? q.pe_ratio : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
