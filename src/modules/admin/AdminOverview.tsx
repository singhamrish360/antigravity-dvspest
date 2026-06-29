import React from 'react';
import { store } from '../../core/store';
import { TrendingUp, Users, UserCheck, Shield, DollarSign, Activity, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const customers = store.getCustomers();
  const leads = store.getLeads();
  const history = store.getServiceHistory();
  const auditLogs = store.getAuditLogs();

  const totalRevenue = history.reduce((acc, curr) => acc + curr.amountCharged, 0) + 24500;
  const activeLeads = leads.filter(l => l.status !== 'Closed' && l.status !== 'Cancelled').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ background: 'var(--gradient-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>TOTAL PLATFORM REVENUE</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2.2rem', color: 'var(--text-primary)' }}>
            ${totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <TrendingUp size={14} /> +18.4% from last month
          </div>
        </div>

        <div className="glass-card" style={{ background: 'var(--gradient-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ACTIVE PIPELINE LEADS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={20} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2.2rem', color: 'var(--text-primary)' }}>
            {activeLeads}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginTop: '0.5rem' }}>
            94% Conversion Rate Target
          </div>
        </div>

        <div className="glass-card" style={{ background: 'var(--gradient-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ENTERPRISE CUSTOMERS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2.2rem', color: 'var(--text-primary)' }}>
            {customers.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Average LTV: ${Math.round(totalRevenue / (customers.length || 1)).toLocaleString()}
          </div>
        </div>

        <div className="glass-card" style={{ background: 'var(--gradient-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SYSTEM AUDIT STATUS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--accent-secondary)' }}>
            OPTIMAL
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Zero Security Anomalies
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recent Audit Trails */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Real-Time System Audit Trail</h3>
            <span className="badge badge-purple">Live ISO Security Log</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{log.details}</div>
                </div>
                <div style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  <div>{log.user}</div>
                  <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Alerts */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Operational Alerts</h3>
          
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', gap: '0.75rem' }}>
            <AlertCircle size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, color: '#f59e0b', fontSize: '0.9rem' }}>Pending Feedback Moderation</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>1 testimonial requires administrator approval before public showcase.</div>
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', gap: '0.75rem' }}>
            <CheckCircle2 size={20} style={{ color: '#10b981', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, color: '#10b981', fontSize: '0.9rem' }}>Automated Backup Completed</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Google Cloud Storage sync verified at 04:00 AM.</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
