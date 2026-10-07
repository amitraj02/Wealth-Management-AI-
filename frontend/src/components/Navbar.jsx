import React from 'react';
import { Sparkles, Bell, RefreshCw, HelpCircle, ShieldCheck, Activity, CheckCircle2, ChevronDown } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  onSelectTab, 
  pendingCount = 0, 
  onOpenPrepareMyDay, 
  onOpenGuide, 
  onSync,
  currentAdvisor,
  onSelectAdvisor
}) {
  const advisorName = currentAdvisor?.name || 'Amit Raj';
  const advisorAvatar = currentAdvisor?.avatar || '/amitraj.png';
  const advisorRole = currentAdvisor?.badge || 'Lead Advisor';

  return (
    <header className="header-container">
      {/* ROW 1: Branding, Actions & Advisor Profile */}
      <div className="header-top-row">
        {/* Brand Logo & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #11131f 0%, #312e81 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(17, 19, 31, 0.25)',
            color: '#a5b4fc',
            fontWeight: 800,
            fontSize: '19px'
          }}>
            R
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Raj AI
              </span>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 700, 
                color: 'var(--brand-violet)', 
                background: 'var(--brand-violet-light)', 
                padding: '2px 7px', 
                borderRadius: '6px' 
              }}>
                Wealth OS
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Governed Intelligence Layer for Wealth Management
            </span>
          </div>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: '#f4fbf0',
            color: '#166534',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-full)',
            padding: '3px 10px',
            fontSize: '11px',
            fontWeight: 700,
            marginLeft: '8px'
          }}>
            <ShieldCheck size={13} color="#16a34a" />
            Governed · Agentic · Finance-Native
          </span>
        </div>

        {/* Right Controls, CTA & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Launch "Prepare My Day" CTA */}
          <button
            onClick={onOpenPrepareMyDay}
            className="btn btn-primary btn-pill"
            style={{ padding: '8px 18px', fontSize: '13px' }}
            title="Run morning portfolio & Dhan feed scan"
          >
            <Sparkles size={15} />
            <span>Prepare My Day</span>
          </button>

          {/* Sync Data */}
          <button
            onClick={onSync}
            className="arrow-circle-btn"
            title="Sync live Dhan feeds and portfolio holdings"
          >
            <RefreshCw size={15} />
          </button>

          {/* Cheatsheet Guide */}
          <button
            onClick={onOpenGuide}
            className="arrow-circle-btn"
            title="Interview Cheatsheet & System Architecture Guide"
          >
            <HelpCircle size={16} />
          </button>

          {/* Pending Approvals Bell */}
          <div 
            onClick={() => onSelectTab('governance')}
            className="arrow-circle-btn"
            style={{ position: 'relative', cursor: 'pointer' }}
            title={`${pendingCount} pending order approvals in Governance Queue`}
          >
            <Bell size={16} />
            {pendingCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--danger)',
                border: '2px solid white'
              }} />
            )}
          </div>

          {/* Advisor Profile Avatar & Switcher */}
          <div 
            onClick={() => onSelectTab('advisors')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 12px 4px 6px',
              background: 'var(--surface-subtle)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-light)',
              marginLeft: '4px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Click to view all 3 Certified Advisors"
          >
            <img
              src={advisorAvatar}
              alt={advisorName}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'center 15%',
                border: '1.5px solid var(--brand-violet)'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {advisorName}
                </span>
                <ChevronDown size={12} color="var(--text-muted)" />
              </div>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 500 }}>
                {advisorRole}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Navigation Bar Capsule & Real-Time Connection Badges */}
      <div className="header-nav-row">
        {/* Navigation Bar Capsule */}
        <nav className="nav-capsule">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`nav-capsule-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('clients')}
            className={`nav-capsule-item ${activeTab === 'clients' ? 'active' : ''}`}
          >
            <span>Portfolio Hub</span>
            <span className="nav-badge">20</span>
          </button>
          <button
            onClick={() => onSelectTab('agent')}
            className={`nav-capsule-item ${activeTab === 'agent' ? 'active' : ''}`}
          >
            <span>AI Insights</span>
          </button>
          <button
            onClick={() => onSelectTab('governance')}
            className={`nav-capsule-item ${activeTab === 'governance' ? 'active' : ''}`}
          >
            <span>Governance</span>
            {pendingCount > 0 && (
              <span className="nav-badge nav-badge-amber">{pendingCount}</span>
            )}
          </button>
          <button
            onClick={() => onSelectTab('integrations')}
            className={`nav-capsule-item ${activeTab === 'integrations' ? 'active' : ''}`}
          >
            Market Feeds
          </button>
          <button
            onClick={() => onSelectTab('advisors')}
            className={`nav-capsule-item ${activeTab === 'advisors' ? 'active' : ''}`}
          >
            Advisor
          </button>
          <button
            onClick={() => onSelectTab('about')}
            className={`nav-capsule-item ${activeTab === 'about' ? 'active' : ''}`}
          >
            About-Us
          </button>
        </nav>

        {/* Live System Status Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11.5px',
            color: 'var(--text-secondary)',
            fontWeight: 600
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)'
            }} />
            <span>Dhan Feed: <strong>Live</strong> (ID: 1104228365)</span>
          </div>

          <span style={{ color: 'var(--border-subtle)', fontSize: '12px' }}>•</span>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11.5px',
            color: 'var(--text-secondary)',
            fontWeight: 600
          }}>
            <Activity size={13} color="var(--brand-violet)" />
            <span>NSDL / CDSL Settled</span>
          </div>

          <span style={{ color: 'var(--border-subtle)', fontSize: '12px' }}>•</span>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11.5px',
            color: '#166534',
            fontWeight: 700
          }}>
            <CheckCircle2 size={13} color="#16a34a" />
            <span>Policy 1 Enforced</span>
          </div>
        </div>
      </div>
    </header>
  );
}
