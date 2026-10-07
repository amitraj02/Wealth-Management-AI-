import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'blue' }) {
  const colorMap = {
    blue: { bg: '#eff6ff', text: '#2563eb', border: '#dbeafe' },
    emerald: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
    amber: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
    purple: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
    rose: { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' }
  };

  const current = colorMap[color] || colorMap.blue;

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            background: current.bg,
            color: current.text,
            border: `1px solid ${current.border}`,
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '6px' }}>
        {value}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
        {trend && (
          <span style={{
            fontWeight: 700,
            color: trend.startsWith('+') ? 'var(--success)' : (trend.startsWith('-') ? 'var(--danger)' : 'var(--text-muted)')
          }}>
            {trend}
          </span>
        )}
        <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>
      </div>
    </div>
  );
}
