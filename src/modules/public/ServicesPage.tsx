import React, { useState } from 'react';
import { Check, Clock, ArrowRight, Calculator } from 'lucide-react';
import { store } from '../../core/store';

interface Props {
  onBookClick: () => void;
}

export const ServicesPage: React.FC<Props> = ({ onBookClick }) => {
  const services = store.getServices();
  const [calcSqFt, setCalcSqFt] = useState<number>(2500);
  const [calcServiceId, setCalcServiceId] = useState<string>(services[0]?.id || '');

  const selectedService = services.find(s => s.id === calcServiceId) || services[0];
  const calculatedEstimate = selectedService ? Math.round(selectedService.basePrice * (calcSqFt / 1500)) : 0;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>Core Pest Solutions</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Pest Control & Fumigation Services</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Transparent rate schedules in Indian Rupees (₹) for Cockroaches, Rodents, Mosquitoes, Termites, and Industrial Fumigation across Lucknow & UP.
        </p>
      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {services.map(srv => (
          <div key={srv.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
            <img src={srv.imageUrl} alt={srv.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-info">{srv.category}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={14} /> {srv.durationMinutes} mins
              </span>
            </div>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>{srv.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6, flexGrow: 1 }}>
              {srv.description}
            </p>

            <div style={{ marginBottom: '1.5rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>SERVICE HIGHLIGHTS</span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {srv.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={14} style={{ color: 'var(--accent-secondary)' }} /> {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--bg-glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>BASE RATE</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent-primary)' }}>₹{srv.basePrice.toLocaleString()}</span>
              </div>
              <button className="btn btn-primary" onClick={onBookClick}>
                Book Now <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Pricing Estimator */}
      <div className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-surface)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="badge badge-success" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calculator size={14} /> Property Rate Matrix (₹)
          </div>
          <h2 style={{ fontSize: '2rem' }}>Property Scale Cost Calculator</h2>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div className="form-group">
              <label className="form-label">Select Service Offering</label>
              <select className="form-control" value={calcServiceId} onChange={e => setCalcServiceId(e.target.value)}>
                {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Property Footprint: {calcSqFt.toLocaleString()} Sq. Ft.</label>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={calcSqFt}
                onChange={e => setCalcSqFt(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', background: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>ESTIMATED TREATMENT INVESTMENT</span>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2.8rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
              ₹{calculatedEstimate.toLocaleString()}
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={onBookClick}>
              Confirm Inspection Request
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
