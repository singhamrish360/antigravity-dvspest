import React from 'react';
import { GraduationCap, MapPin, MessageCircle, Phone } from 'lucide-react';
import { CITY_BASE, CREDENTIALS_LINE, PHONE_DISPLAY, TEL_LINK, WA_BASE } from '../../seo/constants';

export const DrawingsCredentials: React.FC = () => (
  <div className="glass-panel" style={{ padding: '1.75rem', background: '#ffffff' }}>
    <h2 style={{ fontSize: '1.45rem', marginBottom: '0.85rem' }}>Who drafts the drawings</h2>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.85rem' }}>
      <GraduationCap size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: 2 }} />
      <p style={{ margin: 0, lineHeight: 1.6, fontSize: '1.05rem' }}>{CREDENTIALS_LINE}.</p>
    </div>
    <p style={{ color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: 1.6, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
      <MapPin size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: 3 }} />
      <span>Based in {CITY_BASE}. Drawings are delivered online anywhere in India.</span>
    </p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
      <a href={TEL_LINK} className="btn btn-outline" style={{ textDecoration: 'none' }}>
        <Phone size={16} /> Call {PHONE_DISPLAY}
      </a>
      <a href={WA_BASE} target="_blank" rel="noopener noreferrer" className="btn" style={{ textDecoration: 'none', background: '#16a34a', color: '#fff', border: '1px solid #15803d' }}>
        <MessageCircle size={16} /> WhatsApp {PHONE_DISPLAY}
      </a>
    </div>
  </div>
);
