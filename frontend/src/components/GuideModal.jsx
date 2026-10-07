import React, { useState } from 'react';
import { X, BookOpen, ShieldCheck } from 'lucide-react';

export default function GuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('summary');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '850px', maxHeight: '88vh' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex'
            }}>
              <BookOpen size={20} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>FinAdvisor AI — Quick Guide & Interview Cheatsheet</h2>
              <p style={{ fontSize: '12px', opacity: 0.9 }}>
                Simple, beginner-friendly walkthrough of the system
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '8px', background: 'var(--bg-subtle)' }}>
          <button
            onClick={() => setActiveTab('summary')}
            className={`pill-item ${activeTab === 'summary' ? 'active' : ''}`}
          >
            1. Simple Explanation
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`pill-item ${activeTab === 'flow' ? 'active' : ''}`}
          >
            2. The 4-Phase Architecture
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`pill-item ${activeTab === 'interview' ? 'active' : ''}`}
          >
            3. Interview Q&A Pitch
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`pill-item ${activeTab === 'demo' ? 'active' : ''}`}
          >
            4. 2-Minute Demo Steps
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, fontSize: '13.5px', lineHeight: 1.6 }}>
          {activeTab === 'summary' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                What does FinAdvisor AI do?
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Imagine a wealth advisor managing 100+ clients. FinAdvisor AI pulls live stock prices from <strong>Dhan Market API</strong> and client portfolios from custody depositories. It then analyzes risks, detects allocation deviations (e.g. client having 78% equity instead of 65%), and drafts meeting briefs.
              </p>

              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ fontWeight: 700, color: '#1e40af', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} />
                  <span>The "Human-in-the-Loop" Rule</span>
                </div>
                <p style={{ color: '#1e3a8a', fontSize: '13px' }}>
                  The AI <strong>never executes trades or changes records on its own</strong>. It submits a structured recommendation to the advisor's <strong>Governance Approval Queue</strong>. A human must click "Authorize" before anything happens.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'flow' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px 16px', border: '1px solid var(--border-light)', borderRadius: '8px', background: 'var(--bg-surface)' }}>
                <strong style={{ color: 'var(--brand-primary)' }}>Phase 1 — Data Ingestion:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Pulls from Dhan Market API, Custody, and CRM. Validates with Pydantic schemas and saves to unified SQLite/PostgreSQL.
                </p>
              </div>

              <div style={{ padding: '12px 16px', border: '1px solid var(--border-light)', borderRadius: '8px', background: 'var(--bg-surface)' }}>
                <strong style={{ color: '#8b5cf6' }}>Phase 2 — AI Analysis:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Computes portfolio returns, 30-day volatility, Sharpe ratio, and goal progress.
                </p>
              </div>

              <div style={{ padding: '12px 16px', border: '1px solid var(--border-light)', borderRadius: '8px', background: 'var(--bg-surface)' }}>
                <strong style={{ color: '#059669' }}>Phase 3 — MCP Financial Tools:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  The AI uses 7 deterministic tools (e.g. <code>get_portfolio()</code>, <code>calculate_asset_allocation()</code>) so it never guesses or hallucinates.
                </p>
              </div>

              <div style={{ padding: '12px 16px', border: '1px solid var(--border-light)', borderRadius: '8px', background: 'var(--bg-surface)' }}>
                <strong style={{ color: '#d97706' }}>Phase 4 — Governance & Approvals:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Policy Engine enforces 5 rules. Rebalancing trades require explicit Human Advisor authorization and are logged in the immutable audit trail.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'interview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  Q: "How did you build this project?"
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <em>"I built a governed AI platform with FastAPI and React. It unifies financial APIs and market data from Dhan, exposes analytical tools through an MCP server, and enforces human approval guardrails for any rebalancing action."</em>
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  Q: "Why is Governance important?"
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <em>"In financial applications, AI cannot be allowed to execute market orders autonomously due to compliance and volatility risks. Our system requires certified advisor sign-off with audit logging."</em>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'demo' && (
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>How to Demo in 4 Quick Steps:</h4>
              <ol style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Step 1:</strong> Click the <strong>"Prepare My Day"</strong> button at the top to see the morning scan across 20 clients.</li>
                <li><strong>Step 2:</strong> Click <strong>"Generate Brief"</strong> on Rajesh Kumar to view the AI Agent executing MCP tools in real-time.</li>
                <li><strong>Step 3:</strong> Go to <strong>"Governance & Approvals"</strong> and click <strong>"Review & Decide"</strong> to authorize the rebalancing proposal.</li>
                <li><strong>Step 4:</strong> Go to <strong>"Data & Dhan APIs"</strong> to show the live integration layer and stock quotes.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Got it, Let's Explore!
          </button>
        </div>
      </div>
    </div>
  );
}
