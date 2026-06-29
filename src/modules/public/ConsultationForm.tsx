import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, ArrowRight, Building, Home, Factory, MapPin, User, Mail, Phone, Calendar } from 'lucide-react';
import { store } from '../../core/store';
import { Lead } from '../../core/types';

interface Props {
  onSuccess?: (leadId: string) => void;
}

export const ConsultationForm: React.FC<Props> = ({ onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    serviceRequested: 'Comprehensive General Pest Extermination',
    propertyType: 'Residential' as 'Residential' | 'Commercial' | 'Industrial',
    squareFeet: 2500,
    location: 'Metropolis Metro Area',
    referralSource: 'Direct Website'
  });

  const services = store.getServices();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead = store.addLead({
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      serviceRequested: formData.serviceRequested,
      propertyType: formData.propertyType,
      squareFeet: Number(formData.squareFeet),
      location: formData.location,
      referralSource: formData.referralSource,
      ipAddress: '198.51.100.42',
      deviceInfo: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Workstation',
      browserInfo: navigator.userAgent.split(' ')[0]
    });

    setSubmittedLead(newLead);
    setStep(3);
    if (onSuccess) onSuccess(newLead.id);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto', boxShadow: 'var(--shadow-lg)' }}>
      {step < 3 && (
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>Automated Booking Engine</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Request Enterprise Inspection & Consultation</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Instant Lead ID Generation & Technician Dispatch Pipeline</p>

          {/* Step indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 1 ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= 1 ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>1</span>
              Property & Service
            </div>
            <div style={{ width: '40px', height: '2px', background: 'var(--bg-glass-border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 2 ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= 2 ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>2</span>
              Contact Details
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Select Property Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {[
                { type: 'Residential', icon: Home, desc: 'Single & Multi-Family Homes' },
                { type: 'Commercial', icon: Building, desc: 'Offices, Dining & Retail' },
                { type: 'Industrial', icon: Factory, desc: 'Warehousing & Logistics' }
              ].map(item => {
                const Icon = item.icon;
                const isSelected = formData.propertyType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setFormData({ ...formData, propertyType: item.type as any })}
                    style={{
                      padding: '1.25rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--bg-glass-border)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textAlign: 'center',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <Icon size={24} style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.type}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Service Offering</label>
            <select
              className="form-control"
              value={formData.serviceRequested}
              onChange={e => setFormData({ ...formData, serviceRequested: e.target.value })}
            >
              {services.map(srv => (
                <option key={srv.id} value={srv.title}>{srv.title} (${srv.basePrice} base)</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Approximate Area (Sq. Ft.)</label>
              <input
                type="number"
                className="form-control"
                value={formData.squareFeet}
                onChange={e => setFormData({ ...formData, squareFeet: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City / Region Location</label>
              <input
                type="text"
                className="form-control"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <button className="btn btn-primary btn-lg" style={{ marginTop: '1rem', width: '100%' }} onClick={() => setStep(2)}>
            Continue to Contact Info <ArrowRight size={18} />
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name / Authorized Representative</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Eleanor Vance"
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="e.g. eleanor@enterprise.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone Number</label>
              <input
                type="tel"
                required
                className="form-control"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">How Did You Hear About Us?</label>
            <select
              className="form-control"
              value={formData.referralSource}
              onChange={e => setFormData({ ...formData, referralSource: e.target.value })}
            >
              <option value="Direct Website">Direct Website Search</option>
              <option value="Google Search">Google Search / Organic</option>
              <option value="Client Referral">Existing Client Referral</option>
              <option value="LinkedIn Marketing">LinkedIn / Corporate B2B</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>
              Back
            </button>
            <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 2 }}>
              Generate Consultation Lead
            </button>
          </div>
        </form>
      )}

      {step === 3 && submittedLead && (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <CheckCircle size={40} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Consultation Scheduled!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Your enterprise lead has been registered and logged into our central CRM dispatch engine.
          </p>

          <div className="glass-card" style={{ textAlign: 'left', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>UNIQUE LEAD ID</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{submittedLead.id}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>INITIAL STATUS</span>
              <span className="badge badge-info">{submittedLead.status}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>PROPERTY</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{submittedLead.propertyType} ({submittedLead.squareFeet} Sq Ft)</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>LOGGED IP & DEVICE</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{submittedLead.ipAddress} • {submittedLead.deviceInfo}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              Submit Another Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
