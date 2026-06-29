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
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Shield size={20} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              ANTI-GRAVITY
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Next-generation enterprise ecosystem automating pest control operations, commercial sanitation, and AI property diagnostics across North America.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle2 size={16} /> EPA Certified & ISO 9001 Compliant
          </div>
        </div>

        {/* Col 2: Enterprise Contact */}
        <div>
          <h4 style={{ marginBottom: '1.2rem', fontSize: '1.05rem', color: 'var(--text-primary)' }}>Enterprise HQ</h4>
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
          <h4 style={{ marginBottom: '1.2rem', fontSize: '1.05rem', color: 'var(--text-primary)' }}>Solutions</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li>Commercial Pest Management</li>
            <li>Subterranean Termite Barrier</li>
            <li>Hospital-Grade Disinfection</li>
            <li>Smart Acoustic Rodent Exclusion</li>
            <li>AI Computer Vision Diagnostics</li>
          </ul>
        </div>

        {/* Col 4: Operations & Compliance */}
        <div>
          <h4 style={{ marginBottom: '1.2rem', fontSize: '1.05rem', color: 'var(--text-primary)' }}>Operating Hours</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            {settings.operatingHours}
          </p>
          <div className="glass-panel" style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            🔒 256-Bit SSL Encrypted Enterprise Communications & Automated Audit Trail Active
          </div>
        </div>

      </div>

      <div style={{ maxWidth: '1280px', margin: '3rem auto 0 auto', paddingTop: '1.5rem', borderTop: '1px solid var(--bg-glass-border)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div>© 2026 Anti-Gravity Enterprise Ecosystem. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>Privacy Policy</span>
          <span>Terms of Enterprise Service</span>
          <span>Security & Compliance</span>
          <span>Sitemap</span>
        </div>
      </div>
    </footer>
  );
};
