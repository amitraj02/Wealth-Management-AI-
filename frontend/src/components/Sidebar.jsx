import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Bot, 
  ShieldAlert, 
  Database
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, pendingCount = 0 }) {
  const navItems = [
    { id: 'dashboard', label: 'Advisor Overview', icon: LayoutDashboard, badge: null },
    { id: 'clients', label: 'Clients & Portfolios', icon: Users, badge: '20' },
    { id: 'agent', label: 'AI Agent Workspace', icon: Bot, badge: 'MCP' },
    { id: 'governance', label: 'Governance & Approvals', icon: ShieldAlert, badge: pendingCount > 0 ? `${pendingCount}` : null, badgeColor: 'badge-review' },
    { id: 'integrations', label: 'Data & Dhan APIs', icon: Database, badge: 'Live' }
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      flexShrink: 0
    }}>
      <div>
        <div style={{ padding: '0 12px 16px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Wealth Management
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: isActive ? 'var(--brand-subtle)' : 'transparent',
                  color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} color={isActive ? 'var(--brand-primary)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`badge ${item.badgeColor || 'badge-blue'}`} style={{ fontSize: '11px', padding: '2px 8px' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Governance Framework Box */}
      <div style={{
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          <ShieldAlert size={14} color="var(--brand-primary)" />
          <span>Zero Autonomous Trading</span>
        </div>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.4 }}>
          All AI recommendations require explicit Human Advisor approval before dispatch.
        </p>
      </div>
    </aside>
  );
}
