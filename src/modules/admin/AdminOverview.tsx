import React from 'react';
import { store } from '../../core/store';
import { TrendingUp, Users, UserCheck, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const customers = store.getCustomers();
  const leads = store.getLeads();
  const history = store.getServiceHistory();
  const auditLogs = store.getAuditLogs();

  const totalRevenue = history.reduce((acc, curr) => acc + curr.amountCharged, 0);
  const activeLeads = leads.filter(l => l.status !== 'Closed' && l.status !== 'Cancelled').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ background: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>TOTAL PLATFORM REVENUE</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              ₹
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2.2rem', color: 'var(--text-primary)' }}>
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <TrendingUp size={14} /> +24.2% from last month in UP
          </div>
        </div>

        <div className="glass-card" style={{ background: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ACTIVE PIPELINE LEADS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={20} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2.2rem', color: 'var(--text-primary)' }}>
            {activeLeads}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginTop: '0.5rem' }}>
            Lucknow & UP Dispatch Hub Active
          </div>
        </div>

        <div className="glass-card" style={{ background: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ENTERPRISE CUSTOMERS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f3e8ff', color: '#6b21a8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2.2rem', color: 'var(--text-primary)' }}>
            {customers.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Avg LTV: ₹{Math.round(totalRevenue / (customers.length || 1)).toLocaleString()}
          </div>
        </div>

        <div className="glass-card" style={{ background: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>LUCKNOW HQ TELEMETRY</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--accent-secondary)' }}>
            OPTIMAL
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Zero Dispatch Delays
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recent Audit Trails */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Real-Time Operations Audit Log</h3>
            <span className="badge badge-warning">Lucknow System Log</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', background: '#faf8f5' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{log.action}</div>
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
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#ffffff' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Operational Alerts</h3>
          
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: '#fef3c7', border: '1px solid #fde68a', display: 'flex', gap: '0.75rem' }}>
            <AlertCircle size={20} style={{ color: '#b45309', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#b45309', fontSize: '0.9rem' }}>Pending Review Moderation</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>1 Lucknow client review requires administrator approval.</div>
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: '#d1fae5', border: '1px solid #a7f3d0', display: 'flex', gap: '0.75rem' }}>
            <CheckCircle2 size={20} style={{ color: '#047857', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#047857', fontSize: '0.9rem' }}>Fumigation Compliance Verified</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>FSSAI warehouse clearances updated for Amausi hub.</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
