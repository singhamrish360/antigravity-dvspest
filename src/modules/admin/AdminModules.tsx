import React, { useState } from 'react';
import { store } from '../../core/store';
import { Plus, Edit, Check, X } from 'lucide-react';
import { FeedbackStatus } from '../../core/types';

interface Props {
  activeModule: string;
}

export const AdminModulesManager: React.FC<Props> = ({ activeModule }) => {
  const [, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  // Module 1: Customers Management
  if (activeModule === 'customers') {
    const customers = store.getCustomers();
    return (
      <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Customers Management Module</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--bg-glass-border)' }}>
                <th style={{ padding: '0.85rem' }}>ID</th>
                <th style={{ padding: '0.85rem' }}>Customer Name</th>
                <th style={{ padding: '0.85rem' }}>Email & Phone</th>
                <th style={{ padding: '0.85rem' }}>LTV</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                  <td style={{ padding: '0.85rem' }}>{c.id}</td>
                  <td style={{ padding: '0.85rem', fontWeight: 700 }}>{c.fullName}</td>
                  <td style={{ padding: '0.85rem' }}>{c.email} • {c.phone}</td>
                  <td style={{ padding: '0.85rem', color: 'var(--accent-secondary)', fontWeight: 800 }}>₹{c.lifetimeValue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Module 2 & 3: Leads & Service Requests
  if (activeModule === 'leads' || activeModule === 'requests') {
    const leads = store.getLeads();
    return (
      <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Inspection & Consultation Pipeline</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--bg-glass-border)' }}>
                <th style={{ padding: '0.85rem' }}>Lead ID</th>
                <th style={{ padding: '0.85rem' }}>Customer Name</th>
                <th style={{ padding: '0.85rem' }}>Service Requested</th>
                <th style={{ padding: '0.85rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                  <td style={{ padding: '0.85rem' }}>{l.id}</td>
                  <td style={{ padding: '0.85rem', fontWeight: 700 }}>{l.customerName}</td>
                  <td style={{ padding: '0.85rem' }}>{l.serviceRequested}</td>
                  <td style={{ padding: '0.85rem' }}><span className="badge badge-warning">{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Module 4: Employees Management
  if (activeModule === 'employees') {
    const employees = store.getEmployees();
    return (
      <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Technicians Roster & Operations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {employees.map(emp => (
            <div key={emp.id} className="glass-card" style={{ background: '#faf8f5' }}>
              <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>{emp.role}</span>
              <h3 style={{ fontSize: '1.2rem' }}>{emp.fullName}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{emp.email} • {emp.phone}</p>
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--bg-glass-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Assigned Jobs: {emp.assignedJobsCount}</span>
                <span style={{ color: '#d97706', fontWeight: 700 }}>★ {emp.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Module 5 & 12: Services & Pricing CMS
  if (activeModule === 'services' || activeModule === 'pricing') {
    const services = store.getServices();
    return (
      <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Services & Rates Manager (₹)</h2>
          <button className="btn btn-primary btn-sm" onClick={() => alert('Add Service Dialog Configured')}>
            <Plus size={16} /> Add New Service Offering
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {services.map(srv => (
            <div key={srv.id} className="glass-card" style={{ background: '#faf8f5' }}>
              <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>{srv.category}</span>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{srv.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{srv.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--bg-glass-border)' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent-primary)' }}>₹{srv.basePrice.toLocaleString()}</span>
                <button className="btn btn-secondary btn-sm"><Edit size={14} /> Edit Rates</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Module 8 & 9: Feedback Moderation
  if (activeModule === 'feedback' || activeModule === 'reviews') {
    const feedback = store.getFeedback();
    return (
      <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Feedback Moderation Panel</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {feedback.map(item => (
            <div key={item.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#faf8f5' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700 }}>{item.customerName}</span>
                  <span className={`badge ${item.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>{item.status}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>"{item.comment}"</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => { store.updateFeedbackStatus(item.id, 'Approved' as FeedbackStatus); triggerRefresh(); }}>
                  <Check size={14} /> Approve
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => { store.updateFeedbackStatus(item.id, 'Rejected' as FeedbackStatus); triggerRefresh(); }}>
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback for remaining modules
  return (
    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', background: '#ffffff' }}>
      <h2 style={{ marginBottom: '0.5rem', textTransform: 'capitalize' }}>{activeModule.replace('-', ' ')} Module</h2>
      <p style={{ color: 'var(--text-secondary)' }}>DVS Enterprise module active for Lucknow headquarters.</p>
    </div>
  );
};
