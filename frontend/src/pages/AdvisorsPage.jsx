import React from 'react';
import { 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Layers
} from 'lucide-react';
import { ADVISORS } from '../data/advisorsData';

export default function AdvisorsPage({ 
  currentAdvisor, 
  onSelectAdvisor, 
  onNavigateToDashboard, 
  onNavigateToClients 
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-violet" style={{ fontSize: '11.5px' }}>
              <Users size={12} />
              Multi-Advisor Institutional Book
            </span>
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Wealth Advisory Team & Portfolio Leadership
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
            3 Certified Lead Advisors managing <strong>20 High-Net-Worth Accounts</strong> across ₹31.16 Cr in private wealth.
          </p>
        </div>

        <button 
          onClick={onNavigateToDashboard}
          className="btn btn-secondary btn-sm btn-pill"
        >
          <span>Back to Dashboard</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Aggregate Firm Overview Metric Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div className="card-white" style={{ padding: '18px 22px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            CERTIFIED LEAD ADVISORS
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
            3 Partners
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--brand-violet)', fontWeight: 600, marginTop: '2px' }}>
            Bengaluru • Mumbai • Delhi
          </div>
        </div>

        <div className="card-white" style={{ padding: '18px 22px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            TOTAL FIRM AUM
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand-violet)' }}>
            ₹31.16 Cr
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--success)', fontWeight: 600, marginTop: '2px' }}>
            +14.2% YoY Growth
          </div>
        </div>

        <div className="card-white" style={{ padding: '18px 22px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            CLIENT MANDATES
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
            20 Accounts
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
            100% KYC & Mandate Aligned
          </div>
        </div>

        <div className="card-white" style={{ padding: '18px 22px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            GOVERNANCE STANDARD
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--success)' }}>
            Policy 1 Active
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
            Dual-Control Trade Approval
          </div>
        </div>
      </div>

      {/* 3 Advisor Profiles Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '22px'
      }}>
        {ADVISORS.map((advisor) => {
          const isActive = currentAdvisor?.id === advisor.id;
          return (
            <div 
              key={advisor.id} 
              className="card-white" 
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isActive ? '2px solid var(--brand-violet)' : '1px solid var(--border-card)',
                boxShadow: isActive ? '0 12px 32px rgba(88, 68, 237, 0.15)' : 'var(--shadow-card)',
                position: 'relative'
              }}
            >
              {/* Active Badge */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'var(--brand-violet)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 2px 8px rgba(88, 68, 237, 0.3)'
                }}>
                  ACTIVE OPERATOR
                </div>
              )}

              <div>
                {/* Advisor Header with Portrait */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <img
                    src={advisor.avatar}
                    alt={advisor.name}
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      objectPosition: 'center 15%',
                      border: '2.5px solid var(--brand-violet)',
                      boxShadow: '0 4px 14px rgba(88, 68, 237, 0.2)'
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {advisor.name}
                      </h3>
                      <span className="badge badge-violet" style={{ fontSize: '10px' }}>
                        {advisor.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--brand-violet)', fontWeight: 700, marginTop: '2px' }}>
                      {advisor.role}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={11} />
                      <span>{advisor.location}</span>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  background: 'var(--surface-subtle)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>AUM Managed</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>₹{advisor.aumCr} Cr</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Client Book</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{advisor.clientCount} Accounts</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Approvals</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: advisor.pendingApprovals > 0 ? 'var(--warning-text)' : 'var(--success)' }}>
                      {advisor.pendingApprovals} Pending
                    </div>
                  </div>
                </div>

                {/* Broker & Custody Integration */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-light)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Broker / Custody ID:</span>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {advisor.broker} • {advisor.brokerId}
                  </span>
                </div>

                {/* Bio / Specialization */}
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '14px' }}>
                  <strong>Focus:</strong> {advisor.specialization}
                </p>

                {/* Sample Clients in Book */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Key Portfolios in Book:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {advisor.sampleClients.map((client, idx) => (
                      <span key={idx} className="badge badge-subtle" style={{ fontSize: '10.5px', background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0' }}>
                        {client}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <button
                  onClick={() => onSelectAdvisor(advisor)}
                  className={`btn btn-sm btn-pill ${isActive ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ flex: 1 }}
                >
                  {isActive ? (
                    <>
                      <CheckCircle2 size={13} color="var(--success)" />
                      <span>Current Active Advisor</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      <span>Switch to {advisor.name.split(' ')[0]}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onNavigateToClients}
                  className="btn btn-secondary btn-sm btn-pill"
                  title="View portfolios managed by this advisor"
                >
                  <Briefcase size={13} />
                  <span>Portfolios</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Advisor Governance & 4-Eyes Principle Card */}
      <div className="card-white" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <ShieldCheck size={18} color="var(--brand-violet)" />
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Institutional Multi-Advisor Governance Architecture
          </h3>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '960px' }}>
          In <strong>Raj AI Wealth OS</strong>, each client portfolio is strictly partitioned to their assigned Lead Advisor while sharing a central financial normalization and policy engine.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div style={{ background: 'var(--surface-subtle)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              1. Book Partitioning & Privacy
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              Advisors have isolated visibility over their designated client books, KYC records, and customized target allocation percentages.
            </p>
          </div>

          <div style={{ background: 'var(--surface-subtle)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              2. 4-Eyes Co-Signing (Above ₹1 Crore)
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              For high-value rebalances exceeding ₹1 Cr, Policy 1 mandates dual sign-off between Amit Raj, Priya Sharma, or Yash Roy.
            </p>
          </div>

          <div style={{ background: 'var(--surface-subtle)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              3. Verifiable Compliance Logging
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              Every AI recommendation, order authorization, and client communication draft records the certified reviewer's ID into the immutable database audit trail.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
