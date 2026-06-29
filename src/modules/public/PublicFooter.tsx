import React from 'react';
import { Shield, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { store } from '../../core/store';

export const PublicFooter: React.FC = () => {
  const settings = store.getSettings();

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--bg-glass-border)', marginTop: 'auto', padding: '4rem 1.5rem 2rem 1.5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
        
        {/* Col 1: Brand Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Shield size={22} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              DVS PEST CONTROL INFRASTRUCTURE CO
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Premier pest management infrastructure enterprise specializing in Cockroaches, Rodents, Mosquitoes, Termites control, and Industrial Fumigation services across Uttar Pradesh.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle2 size={16} /> ISO Certified & FSSAI Compliant Solutions
          </div>
        </div>

        {/* Col 2: Enterprise Contact */}
        <div>
          <h4 style={{ marginBottom: '1.2rem', fontSize: '1.05rem', color: 'var(--text-primary)' }}>Lucknow Headquarters</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <MapPin size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '3px' }} />
              <span>{settings.address}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span>{settings.contactPhone}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span>{settings.contactEmail}</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Quick Links */}
        <div>
          <h4 style={{ marginBottom: '1.2rem', fontSize: '1.05rem', color: 'var(--text-primary)' }}>Core Solutions</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li>Advanced Cockroaches Control (Herbal Gel)</li>
            <li>Smart Rodents Control & Exclusion</li>
            <li>Anti-Mosquitoes Fogging & Larvicide</li>
            <li>Subterranean Termites Control Shield (5-Yr Warranty)</li>
            <li>Industrial & Grain Warehouse Fumigation</li>
          </ul>
        </div>

        {/* Col 4: Operations & Compliance */}
        <div>
          <h4 style={{ marginBottom: '1.2rem', fontSize: '1.05rem', color: 'var(--text-primary)' }}>Operating Hours</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            {settings.operatingHours}
          </p>
          <div className="glass-panel" style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            🔒 256-Bit SSL Encrypted Enterprise Communications Active
          </div>
        </div>

      </div>

      <div style={{ maxWidth: '1280px', margin: '3rem auto 0 auto', paddingTop: '1.5rem', borderTop: '1px solid var(--bg-glass-border)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div>© 2026 DVS PEST CONTROL INFRASTRUCTURE CO. All rights reserved. Lucknow, UP.</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Compliance</span>
          <span>Lucknow HQ</span>
        </div>
      </div>
    </footer>
  );
};
