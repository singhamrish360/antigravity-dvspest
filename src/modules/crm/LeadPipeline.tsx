import React, { useState } from 'react';
import { Lead, LeadStatus } from '../../core/types';
import { store } from '../../core/store';
import { UserCheck, Calendar, DollarSign, ArrowRight, ShieldAlert, ChevronRight } from 'lucide-react';

export const LeadPipeline: React.FC = () => {
  const leads = store.getLeads();
  const employees = store.getEmployees().filter(e => e.role === 'Field Technician');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const stages: LeadStatus[] = [
    'New', 'Assigned', 'Contacted', 'Scheduled', 'Visited', 'Quoted', 'Confirmed', 'Completed', 'Closed', 'Cancelled'
  ];

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    store.updateLeadStatus(leadId, newStatus);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <div className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>Lead Lifecycle Engine</div>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Consultation Pipeline Kanban</h1>
      </div>

      {/* Kanban Board Container */}
      <div style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '1rem', minHeight: '650px' }}>
        {stages.map(stage => {
          const stageLeads = leads.filter(l => l.status === stage);
          return (
            <div
              key={stage}
              className="glass-panel"
              style={{
                width: '300px',
                minWidth: '300px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1rem',
                background: 'var(--bg-secondary)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-glass-border)', paddingBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{stage}</span>
                <span className="badge badge-purple">{stageLeads.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flexGrow: 1, overflowY: 'auto' }}>
                {stageLeads.map(lead => (
                  <div
                    key={lead.id}
                    className="glass-card"
                    style={{ padding: '1rem', borderLeft: '3px solid var(--accent-primary)', cursor: 'pointer' }}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{lead.id}</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{lead.customerName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{lead.serviceRequested}</div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--bg-glass-border)' }}>
                      <span>{lead.propertyType} ({lead.squareFeet} sqft)</span>
                      {lead.quotedAmount && <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>${lead.quotedAmount}</span>}
                    </div>

                    {/* Stage Transition Buttons */}
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.25rem', overflowX: 'auto' }}>
                      <select
                        className="form-control"
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem' }}
                        value={lead.status}
                        onChange={e => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        onClick={e => e.stopPropagation()}
                      >
                        {stages.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead Modal Detail */}
      {selectedLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '650px', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--bg-glass-border)', paddingBottom: '1rem' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '0.25rem' }}>{selectedLead.id}</span>
                <h2 style={{ fontSize: '1.5rem' }}>{selectedLead.customerName}</h2>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedLead(null)}>Close</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div><strong>Email:</strong> {selectedLead.email}</div>
              <div><strong>Phone:</strong> {selectedLead.phone}</div>
              <div><strong>Service:</strong> {selectedLead.serviceRequested}</div>
              <div><strong>Location:</strong> {selectedLead.location}</div>
              <div><strong>IP Address:</strong> {selectedLead.ipAddress}</div>
              <div><strong>Device:</strong> {selectedLead.deviceInfo}</div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Update Lead Status Workflow</label>
              <select className="form-control" value={selectedLead.status} onChange={e => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}>
                {stages.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <div style={{ borderTop: '1px solid var(--bg-glass-border)', paddingTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              🔒 All lead status modifications trigger automatic audit trail entries in accordance with Enterprise ISO standards.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
