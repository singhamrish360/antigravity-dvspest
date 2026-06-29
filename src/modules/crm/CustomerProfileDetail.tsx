import React, { useState } from 'react';
import { Customer, ServiceHistoryRecord, AMCRecord, WarrantyRecord } from '../../core/types';
import { store } from '../../core/store';
import { ArrowLeft, MapPin, Phone, Mail, Calendar, Shield, DollarSign, Clock, FileText, CheckCircle, Plus, Camera, Notebook } from 'lucide-react';

interface Props {
  customer: Customer;
  onBack: () => void;
}

export const CustomerProfileDetail: React.FC<Props> = ({ customer, onBack }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'services' | 'contracts' | 'photos' | 'notes'>('timeline');
  const [newNote, setNewNote] = useState('');

  const history = store.getServiceHistory().filter(h => h.customerId === customer.id);
  const amcs = store.getAMCs().filter(a => a.customerId === customer.id);
  const warranties = store.getWarranties().filter(w => w.customerId === customer.id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    customer.internalNotes.unshift(newNote);
    store.logAudit('CUSTOMER_NOTE_ADDED', 'CRM Customer Profile', `Added technician note for ${customer.fullName}`);
    setNewNote('');
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Navigation */}
      <div>
        <button className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }} onClick={onBack}>
          <ArrowLeft size={16} /> Back to Customer Master Directory
        </button>

        {/* 360 Customer Header Card */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', background: 'var(--gradient-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <img src={customer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'} alt="" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>{customer.fullName}</h1>
                <span className="badge badge-purple">{customer.id}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={16} /> {customer.email}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={16} /> {customer.phone}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16} /> {customer.address.street}, {customer.address.city}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', borderLeft: '1px solid var(--bg-glass-border)', paddingLeft: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>LIFETIME VALUE</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.8rem', color: 'var(--accent-secondary)' }}>
                ${customer.lifetimeValue.toLocaleString()}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>LEAD SOURCE</span>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{customer.leadSource}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--bg-glass-border)', paddingBottom: '0.5rem' }}>
        {[
          { id: 'timeline', label: 'Activity Timeline', icon: Clock },
          { id: 'services', label: 'Service History', icon: CheckCircle },
          { id: 'contracts', label: 'AMC & Warranties', icon: Shield },
          { id: 'photos', label: 'Before & After Inspection Photos', icon: Camera },
          { id: 'notes', label: 'Internal Technician Notes', icon: Notebook }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.65rem 1rem',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem'
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'timeline' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Complete Customer Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '2rem', borderLeft: '2px solid var(--bg-glass-border)' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-2.6rem', top: '0', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-secondary)' }} />
              <div style={{ fontWeight: 600 }}>Account Created & First Consultation Registered</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{customer.createdAt}</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Lead source attribute logged as "{customer.leadSource}".</p>
            </div>

            {history.map(h => (
              <div key={h.id} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-2.6rem', top: '0', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                <div style={{ fontWeight: 600 }}>{h.serviceTitle} Completed</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.date} • Tech: {h.technicianName}</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{h.technicianNotes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No service history records found.</p> : history.map(h => (
            <div key={h.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{h.serviceTitle}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date: {h.date} • Dispatch ID: {h.id}</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{h.technicianNotes}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-success" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{h.status}</span>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent-primary)' }}>${h.amountCharged}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'contracts' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Annual Maintenance Contracts (AMC)</h3>
            {amcs.map(a => (
              <div key={a.id} className="glass-card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{a.servicePackage}</span>
                  <span className="badge badge-success">{a.status}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Contract Term: {a.startDate} to {a.endDate}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginTop: '0.5rem', fontWeight: 600 }}>Visits Completed: {a.visitsCompleted} / {a.visitsPerYear}</div>
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Warranty Coverage Certificates</h3>
            {warranties.map(w => (
              <div key={w.id} className="glass-card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{w.serviceTitle}</span>
                  <span className="badge badge-info">{w.status}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Warranty Term: {w.warrantyPeriodMonths} Months</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Expires: {w.expiryDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'photos' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {history.flatMap(h => [...h.beforeImages, ...h.afterImages]).map((img, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '0.75rem' }}>
              <img src={img} alt="Inspection Photo" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Field Inspection Telemetry</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Internal Technician & Operations Log</h3>
          
          <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Add confidential internal note..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <Plus size={16} /> Save Note
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {customer.internalNotes.map((note, i) => (
              <div key={i} className="glass-card" style={{ padding: '1rem', borderLeft: '3px solid var(--accent-primary)' }}>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{note}</p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Recorded by Authorized Operations Specialist</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
