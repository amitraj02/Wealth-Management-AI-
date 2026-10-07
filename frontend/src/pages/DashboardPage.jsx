import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldAlert, 
  Printer, 
  Download, 
  X, 
  ArrowDownUp, 
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function DashboardPage({ 
  stats, 
  currentAdvisor,
  onOpenPrepareMyDay, 
  onSelectClient, 
  onOpenChatWithQuery, 
  onNavigateToGovernance,
  onNavigateToClients 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const advName = currentAdvisor?.name || 'Amit Raj';
  const advAvatar = currentAdvisor?.avatar || '/amitraj.png';
  const advRole = currentAdvisor?.badge || 'Lead Advisor';

  // Sample clients for the Account Performance table (matching ui2.jpeg)
  const clientAccounts = [
    { id: 1, name: 'Rajesh Kumar', code: 'CL-101', type: 'Moderate', balance: '₹48,20,000', status: 'Critical', issue: '+13% Equity Drift' },
    { id: 2, name: 'Amit Raj', code: 'CL-102', type: 'Aggressive', balance: '₹82,00,000', status: 'Review', issue: 'Tax Harvesting' },
    { id: 3, name: 'Dr. Neha Singh', code: 'CL-103', type: 'Conservative', balance: '₹95,00,000', status: 'Critical', issue: 'Goal Deficit' },
    { id: 4, name: 'Isaac Bakshi', code: 'CL-104', type: 'Moderate', balance: '₹61,40,000', status: 'Active', issue: 'Balanced' },
    { id: 5, name: 'Anvi Konda', code: 'CL-105', type: 'Moderate', balance: '₹54,80,000', status: 'Active', issue: 'Balanced' },
    { id: 6, name: 'Udant Dewan', code: 'CL-106', type: 'Conservative', balance: '₹72,10,000', status: 'Active', issue: 'Balanced' }
  ];

  const filteredAccounts = clientAccounts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      
      {/* 1. NeuroVest Hero Header Row */}
      <div className="neuro-hero">
        <div className="neuro-title-block">
          <h1>Portfolio Overview</h1>
          <p>
            Governed Wealth Intelligence Layer across <strong>20 HNW Accounts</strong> • Dhan Live Market Feeds Active
          </p>
        </div>

        {/* In-line KPI Metric Strip (from ui1.jpeg) */}
        <div className="neuro-metric-strip">
          {/* Circular Risk Level Gauge */}
          <div className="risk-meter-badge">
            <div style={{ position: 'relative', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="38" height="38" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                <circle 
                  cx="18" cy="18" r="14" fill="none" stroke="#5844ed" strokeWidth="3.5"
                  strokeDasharray="88" strokeDashoffset="26" strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
              <div style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#5844ed'
              }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Risk Level
              </span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Safe / Mod
              </span>
            </div>
          </div>

          {/* Total Portfolio Value */}
          <div className="neuro-metric-item">
            <span className="neuro-metric-label">Total Portfolio Value</span>
            <div className="neuro-metric-value">
              <span style={{ color: 'var(--brand-violet)', fontSize: '16px' }}>₹</span>
              <span>{stats?.total_aum_cr || '31.16'} Cr</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>AUM</span>
            </div>
          </div>

          {/* AI Predicted 7-Day Growth */}
          <div className="neuro-metric-item">
            <span className="neuro-metric-label">AI Predicted 7-Day Growth</span>
            <div className="neuro-metric-value" style={{ color: 'var(--success)' }}>
              <TrendingUp size={16} />
              <span>+5.6%</span>
            </div>
          </div>

          {/* Top Gainer */}
          <div className="neuro-metric-item">
            <span className="neuro-metric-label">Top Gainer Today</span>
            <div className="neuro-metric-value" style={{ color: '#0284c7' }}>
              <RotateCcw size={15} />
              <span>+8.4%</span>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>TATA MOTORS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 4-Column Card Grid (Directly matching ui1.jpeg) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1.25fr 1.25fr 1.3fr',
        gap: '20px',
        alignItems: 'stretch'
      }}>
        
        {/* Column 1: Advisor Card + Financial Report Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Advisor Portrait Card */}
          <div className="card-white" style={{
            position: 'relative',
            height: '245px',
            overflow: 'hidden',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            boxShadow: 'var(--shadow-card)'
          }}>
            <img 
              src={advAvatar} 
              alt={advName}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 15%',
                filter: 'brightness(0.96)'
              }}
            />
            {/* Gradient Overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '75%',
              background: 'linear-gradient(to top, rgba(17, 19, 31, 0.85) 0%, rgba(17, 19, 31, 0.2) 65%, transparent 100%)'
            }} />

            {/* Advisor Card Content */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                  {advName}
                </h4>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '11px', fontWeight: 500 }}>
                  {advRole} • Wealth Manager
                </span>
              </div>

              <button
                onClick={() => onOpenChatWithQuery(`Hello ${advName.split(' ')[0]}, review today's portfolio highlights and Dhan price shifts.`)}
                className="btn btn-secondary btn-sm btn-pill"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: 'var(--brand-violet)',
                  fontWeight: 700,
                  fontSize: '11px',
                  padding: '6px 12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                <Sparkles size={12} color="var(--brand-violet)" />
                <span>Chat with AI</span>
              </button>
            </div>
          </div>

          {/* Financial Report Dark Card */}
          <div className="card-dark" style={{
            padding: '18px',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--surface-dark)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <X size={14} color="#94a3b8" />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={onOpenPrepareMyDay}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#fff'
                  }}
                  title="Print Report"
                >
                  <Printer size={13} />
                </button>
                <button 
                  onClick={onOpenPrepareMyDay}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#fff'
                  }}
                  title="Download Daily PDF"
                >
                  <Download size={13} />
                </button>
              </div>
            </div>

            <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Your Morning Scan Is Ready
            </span>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff', marginTop: '2px', letterSpacing: '-0.02em' }}>
              Financial Report
            </h3>
          </div>
        </div>

        {/* Column 2: Market Analysis Donut Card */}
        <div className="card-white" style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Market Analysis
              </h3>
              <div onClick={onOpenPrepareMyDay} className="arrow-circle-btn" title="Expand Market Analysis">
                <ArrowUpRight size={16} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '18px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5844ed' }}></span>
                ENERGY -2.1%
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#11131f' }}></span>
                TECH +5.4%
              </span>
            </div>

            {/* Donut Chart with Center Dual Arrow Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              margin: '10px 0'
            }}>
              <svg width="150" height="150" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                {/* Segment 1: Tech/Equity (Dark) */}
                <circle
                  cx="50" cy="50" r="38" fill="none" stroke="#11131f" strokeWidth="16"
                  strokeDasharray="140 240" strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                {/* Segment 2: Energy/Bonds (Purple) */}
                <circle
                  cx="50" cy="50" r="38" fill="none" stroke="#5844ed" strokeWidth="16"
                  strokeDasharray="65 240" strokeDashoffset="-140"
                  transform="rotate(-90 50 50)"
                />
                {/* Segment 3: Cash (Light Slate) */}
                <circle
                  cx="50" cy="50" r="38" fill="none" stroke="#cbd5e1" strokeWidth="16"
                  strokeDasharray="35 240" strokeDashoffset="-205"
                  transform="rotate(-90 50 50)"
                />
              </svg>

              {/* Center Icon (from ui1.jpeg) */}
              <div style={{
                position: 'absolute',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)'
              }}>
                <ArrowDownUp size={16} />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
              + 12% volume
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
              VS 30-DAY AVERAGE • LOW REBALANCE DRIFT
            </span>
          </div>
        </div>

        {/* Column 3: Portfolio Performance & Forecast Card */}
        <div className="card-white" style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Portfolio
              </h3>
              <div onClick={onNavigateToClients} className="arrow-circle-btn" title="View Portfolios">
                <ArrowUpRight size={16} />
              </div>
            </div>

            {/* Vertical Bar Columns with Tooltip on Friday (from ui1.jpeg) */}
            <div style={{
              height: '140px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              padding: '10px 4px 0',
              position: 'relative'
            }}>
              {/* Tooltip on Friday Bar */}
              <div style={{
                position: 'absolute',
                top: '0px',
                left: '42%',
                background: '#11131f',
                color: '#ffffff',
                padding: '4px 8px',
                borderRadius: '9999px',
                fontSize: '10.5px',
                fontWeight: 700,
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                whiteSpace: 'nowrap',
                zIndex: 10
              }}>
                Reliance +7.2%
              </div>

              {/* Bar items */}
              {[
                { day: 'Mon', h: '55%', active: false },
                { day: 'Tue', h: '75%', active: false },
                { day: 'Wed', h: '62%', active: false },
                { day: 'Thu', h: '40%', active: false },
                { day: 'Fri', h: '92%', active: true },
                { day: 'Sat', h: '68%', active: false },
                { day: 'Sun', h: '78%', active: false },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{
                    width: '6px',
                    height: b.h,
                    borderRadius: '9999px',
                    background: b.active ? '#5844ed' : '#11131f',
                    transition: 'height 0.3s ease'
                  }} />
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {b.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
              AI forecast
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
              PROJECTED +6.1% ALPHA
            </span>
          </div>
        </div>

        {/* Column 4: AI Insights Dark Card (Directly from ui1.jpeg) */}
        <div className="card-dark" style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'var(--surface-dark)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#ffffff' }}>
                AI Insights
              </h3>
              <div 
                onClick={() => onOpenChatWithQuery("Provide deep AI insights on Dhan price movements and portfolio drift.")} 
                className="arrow-circle-btn-dark"
                title="Open AI Insights"
              >
                <ArrowUpRight size={16} />
              </div>
            </div>

            {/* Clickable AI Prompt Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              <button
                onClick={() => onOpenChatWithQuery("Analyze why tech sector shows bullish signs across our portfolios")}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '7px 12px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>Tech sector shows bullish rally</span>
                <span style={{ color: '#a5b4fc', fontSize: '14px', fontWeight: 700 }}>+</span>
              </button>

              <button
                onClick={() => onOpenChatWithQuery("What is the impact of energy volatility on client portfolios?")}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '7px 12px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>Energy volatility from supply shifts</span>
                <span style={{ color: '#a5b4fc', fontSize: '14px', fontWeight: 700 }}>+</span>
              </button>

              <button
                onClick={() => onOpenChatWithQuery("Summarize news and sentiment across top 10 portfolio holdings")}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '7px 12px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>AI insights from news & sentiment</span>
                <span style={{ color: '#a5b4fc', fontSize: '14px', fontWeight: 700 }}>+</span>
              </button>
            </div>

            {/* Editorial Quote Box */}
            <p style={{
              fontSize: '12px',
              fontStyle: 'italic',
              color: '#94a3b8',
              lineHeight: 1.45,
              borderLeft: '2px solid #5844ed',
              paddingLeft: '10px'
            }}>
              "AI-generated insights based on global news, live Dhan feeds, and SEBI compliance guidelines."
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
            <button
              onClick={onOpenPrepareMyDay}
              className="btn btn-primary btn-pill btn-sm"
              style={{ padding: '6px 18px', fontWeight: 700 }}
            >
              Scan Portfolios
            </button>
          </div>
        </div>
      </div>

      {/* 3. Income Sources Strip (from ui1.jpeg bottom) */}
      <div className="card-white" style={{
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Income Sources & Inflows
            </span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹6,48,000 <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>/MONTH</span>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: '6px 18px', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5844ed' }}></span>
              BONUS & SIP
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8' }}></span>
              DIVIDEND FLOW
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#11131f' }}></span>
              ESOP TRANCHE
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }}></span>
              BOND COUPON
            </span>
          </div>
        </div>

        {/* Visual Progress Capsules (from ui1.jpeg) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 800,
            fontSize: '13px',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-card)'
          }}>
            +7.7%
          </div>

          <div style={{
            background: '#334155',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 800,
            fontSize: '13px'
          }}>
            -12.7%
          </div>

          <div className="striped-capsule-purple" style={{
            padding: '10px 24px',
            fontSize: '13px'
          }}>
            +32%
          </div>

          <div className="striped-capsule-grey" style={{
            padding: '10px 24px',
            fontSize: '13px'
          }}>
            +26%
          </div>
        </div>
      </div>

      {/* 4. Lower Grid: Account Performance Table + Expense Breakdown (from ui2.jpeg) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px'
      }}>
        {/* Account Performance Table Card */}
        <div className="card-white" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Account Performance
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Managing 20 High-Net-Worth Portfolios
              </span>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search account..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 30px',
                  borderRadius: '9999px',
                  border: '1px solid var(--border-light)',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Account Name</th>
                  <th>Risk Profile</th>
                  <th>Net Balance</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.code}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-violet" style={{ fontSize: '11px' }}>
                        {c.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {c.balance}
                    </td>
                    <td>
                      {c.status === 'Critical' && (
                        <span className="badge badge-critical" style={{ fontSize: '11px' }}>
                          <AlertTriangle size={11} />
                          {c.issue}
                        </span>
                      )}
                      {c.status === 'Review' && (
                        <span className="badge badge-review" style={{ fontSize: '11px' }}>
                          <ShieldAlert size={11} />
                          {c.issue}
                        </span>
                      )}
                      {c.status === 'Active' && (
                        <span className="badge badge-stable" style={{ fontSize: '11px' }}>
                          <CheckCircle2 size={11} />
                          Active
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => onSelectClient(c.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '11.5px' }}
                        >
                          View 360
                        </button>
                        <button
                          onClick={() => onOpenChatWithQuery(`Prepare an executive review for ${c.name}`)}
                          className="btn btn-primary btn-sm btn-pill"
                          style={{ padding: '4px 10px', fontSize: '11.5px' }}
                        >
                          <Sparkles size={11} />
                          AI Brief
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense Breakdown Donut Card (from ui2.jpeg) */}
        <div className="card-white" style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Allocation Breakdown
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Aggregate holdings across 20 accounts
            </span>

            {/* Donut Chart (Matching ui2.jpeg) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '18px 0'
            }}>
              <svg width="150" height="150" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="18" />
                {/* Large Cap (Indigo/Purple 46%) */}
                <circle
                  cx="50" cy="50" r="38" fill="none" stroke="#5844ed" strokeWidth="18"
                  strokeDasharray="110 240" strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                {/* Office/Fixed Income (Cyan 24%) */}
                <circle
                  cx="50" cy="50" r="38" fill="none" stroke="#0ea5e9" strokeWidth="18"
                  strokeDasharray="58 240" strokeDashoffset="-110"
                  transform="rotate(-90 50 50)"
                />
                {/* Liquid Cash (Slate Blue 11%) */}
                <circle
                  cx="50" cy="50" r="38" fill="none" stroke="#38bdf8" strokeWidth="18"
                  strokeDasharray="26 240" strokeDashoffset="-168"
                  transform="rotate(-90 50 50)"
                />
                {/* Alternative 10% */}
                <circle
                  cx="50" cy="50" r="38" fill="none" stroke="#818cf8" strokeWidth="18"
                  strokeDasharray="24 240" strokeDashoffset="-194"
                  transform="rotate(-90 50 50)"
                />
                {/* Tech 9% */}
                <circle
                  cx="50" cy="50" r="38" fill="none" stroke="#c7d2fe" strokeWidth="18"
                  strokeDasharray="22 240" strokeDashoffset="-218"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>

            {/* Legend with Percentages (from ui2.jpeg) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Large Cap Equities</span>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>46%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Govt & AAA Debt</span>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>24%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Liquid Cash & MMF</span>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>11%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Gold & Commodities</span>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>10%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Technology Holdings</span>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>9%</span>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToGovernance}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', marginTop: '16px', borderRadius: 'var(--radius-md)' }}
          >
            Review Governance Rules
          </button>
        </div>
      </div>

    </div>
  );
}
