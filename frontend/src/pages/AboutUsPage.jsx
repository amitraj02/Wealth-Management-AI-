import React from 'react';
import { 
  Code, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  Award,
  Terminal,
  Layers,
  FileCode
} from 'lucide-react';

export default function AboutUsPage({ onNavigateToDashboard, onNavigateToAgent }) {
  const technicalSkills = [
    { category: "Backend & Systems", items: ["Python 3.13", "FastAPI", "Async SQLAlchemy", "Pydantic v2", "SQLite / PostgreSQL", "REST APIs"] },
    { category: "Frontend & UI Design", items: ["React 18", "Vite", "Modern CSS Architecture", "Component State Management", "Data Visualizations"] },
    { category: "AI & Agent Architecture", items: ["Model Context Protocol (MCP)", "Governed AI Copilots", "Deterministic Prompt Engineering", "Tool Tracing"] },
    { category: "FinTech & Integrations", items: ["Dhan Market API (Client ID: 1104228365)", "NSDL/CDSL Depository Data", "Portfolio Drift Analysis", "SEBI Policy Enforcement"] }
  ];

  const architecturalPillars = [
    {
      icon: Database,
      title: "1. Financial Data Integration",
      desc: "Connects upstream broker feeds (Dhan live market data), depository holdings (NSDL/CDSL), and wealth CRM profiles through a rigorous Pydantic validation and reconciliation layer."
    },
    {
      icon: Cpu,
      title: "2. Governed AI Agent Engine",
      desc: "Implements Model Context Protocol (MCP) tools for mathematical portfolio drift analysis, market valuation, and automated client meeting brief generation with verifiable tool execution traces."
    },
    {
      icon: ShieldCheck,
      title: "3. Institutional Governance Layer",
      desc: "Guarantees zero autonomous trade execution (Policy 1). Rebalancing orders and client emails require mandatory Human-in-the-Loop advisor approval with an immutable audit log."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-violet" style={{ fontSize: '11.5px' }}>
              <Code size={12} />
              Engineer Profile & Technical Blueprint
            </span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            About the Developer & Project Architecture
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Building finance-native, governed AI systems for next-generation private wealth and asset management.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={onNavigateToDashboard}
            className="btn btn-secondary btn-sm btn-pill"
          >
            <span>View Dashboard</span>
          </button>
          <button 
            onClick={onNavigateToAgent}
            className="btn btn-primary btn-sm btn-pill"
          >
            <Sparkles size={13} />
            <span>Try AI Agent</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Developer Profile + Project Vision */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 2fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Developer Card (Amit Raj) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-white" style={{ padding: '24px', textAlign: 'center', position: 'relative' }}>
            {/* Developer Photo */}
            <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 16px' }}>
              <img
                src="/amitraj.png"
                alt="Amit Raj"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  objectPosition: 'center 15%',
                  border: '3px solid var(--brand-violet)',
                  boxShadow: '0 8px 24px rgba(88, 68, 237, 0.25)'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                background: '#10b981',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '3px solid white'
              }} title="Available for Engineering Opportunities" />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>
              Amit Raj
            </h2>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--brand-violet)', marginBottom: '6px' }}>
              Full-Stack AI & Financial Systems Engineer
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Bengaluru, India • Integrated via Dhan Broker (Client ID: <strong>1104228365</strong>)
            </div>

            <p style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              textAlign: 'left',
              background: 'var(--surface-subtle)',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              marginBottom: '18px'
            }}>
              "I specialize in architecting high-reliability software at the intersection of <strong>Financial Markets, Agentic AI, and Institutional Governance</strong>. I believe generative AI must be finance-native—deterministic in safety, auditable in calculations, and strictly governed by certified human professionals."
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>20</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Clients Modeled</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-light)' }} />
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-violet)' }}>₹31.16 Cr</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>AUM Tracked</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-light)' }} />
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981' }}>100%</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Policy Governed</div>
              </div>
            </div>
          </div>

          {/* Technical Skills Breakdown */}
          <div className="card-white" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={17} color="var(--brand-violet)" />
              <span>Core Technical Competencies</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {technicalSkills.map((s, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {s.category}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {s.items.map((item, i) => (
                      <span key={i} className="badge badge-violet" style={{ fontSize: '11px', padding: '3px 9px' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Project Work & Architectural Deep Dive */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Executive Overview Card */}
          <div className="card-white" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-stable" style={{ fontSize: '11px' }}>
                <Award size={12} />
                Raj AI: Wealth OS Architecture
              </span>
            </div>
            
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
              What is this Project & Why was it Built?
            </h2>

            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '14px' }}>
              In private wealth management, senior advisors are overburdened with managing 50–100 High-Net-Worth (HNW) client accounts. Daily manual checks for equity allocation drift, SEBI single-stock concentration limits, dividend accruals, and sudden market volatility take 4+ hours every morning.
            </p>

            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '18px' }}>
              Standard generative AI models hallucinate financial figures and cannot execute compliant institutional actions. <strong>Wealth OS (FinAdvisor AI)</strong> introduces a <strong>governed intelligence layer</strong> designed specifically for institutional wealth and asset managers.
            </p>

            {/* Value Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', background: 'var(--surface-subtle)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>MORNING SCAN TIME</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>&lt; 400 ms</div>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Scans 20 portfolios</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>UNAUTHORIZED TRADES</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>0 (Zero)</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Policy 1 Enforced</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>BROKER INTEGRATION</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-violet)' }}>Dhan API</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>ID: 1104228365</div>
              </div>
            </div>
          </div>

          {/* 3 Core Architecture Pillars */}
          <div className="card-white" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--brand-violet)" />
              <span>Three Engineering Pillars of this System</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {architecturalPillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '14px 16px',
                    background: 'var(--surface-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'var(--surface-white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand-violet)',
                      boxShadow: 'var(--shadow-card)',
                      flexShrink: 0
                    }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '3px' }}>
                        {p.title}
                      </h4>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                        {p.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Institutional Compliance Card */}
          <div className="card-dark" style={{ padding: '22px', background: 'var(--surface-dark)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#10b981" />
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                  Institutional Human-in-the-Loop Governance Standard
                </h4>
              </div>
              <span className="badge badge-stable" style={{ fontSize: '10.5px' }}>
                Policy Enforced
              </span>
            </div>

            <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.55, marginBottom: '14px' }}>
              Wealth OS implements the institutional governance framework engineered for Raj-AI:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '12px', color: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#10b981" />
                <span>Policy 1: Prohibit Autonomous Trading</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#10b981" />
                <span>Policy 2: Financial Records Integrity</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#10b981" />
                <span>Policy 3: Outbound Gatekeeper</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#10b981" />
                <span>Policy 5: Mandatory Audit Traceability</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
