import React from 'react';
import { Shield, Phone, Mail, MapPin, MessageCircle, PencilRuler } from 'lucide-react';
import { store } from '../../core/store';
import { NavigationMode } from '../../core/types';
import { handleInternalNav } from '../../seo/navigate';

interface Props {
  onChatClick?: () => void;
  onDrawingsClick?: () => void;
  onServicesClick?: () => void;
  onContactClick?: () => void;
  onLoginClick?: () => void;
  setMode?: (mode: NavigationMode) => void;
}

const PHONE_TEL = 'tel:+919330478897';
const WHATSAPP_URL = 'https://wa.me/919330478897';

export const PublicFooter: React.FC<Props> = ({
  onChatClick,
  onDrawingsClick,
  onServicesClick,
  onContactClick,
  onLoginClick,
}) => {
  const settings = store.getSettings();

  const linkBtn: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    color: 'var(--accent-primary)',
    fontWeight: 700,
    fontSize: '0.9rem',
    fontFamily: 'inherit'
  };

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--bg-glass-border)', marginTop: 'auto', padding: '3.5rem 1.25rem 6.5rem' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.9rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Shield size={18} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              DVS Pest Control
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: 1.6 }}>
            Pest control for homes and businesses in Lucknow and Uttar Pradesh, and house drawings delivered anywhere in India.
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Contact</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <MapPin size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
              <span>{settings.address || 'Lucknow'}</span>
            </li>
            <li>
              <a href={PHONE_TEL} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'inherit', textDecoration: 'none' }}>
                <Phone size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                {settings.contactPhone}
              </a>
            </li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'inherit', textDecoration: 'none' }}>
                <MessageCircle size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.contactEmail}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'inherit', textDecoration: 'none' }}>
                <Mail size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                {settings.contactEmail}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Explore</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
            {onServicesClick && (
              <li><button type="button" style={linkBtn} onClick={onServicesClick}>Pest Control &amp; Rates</button></li>
            )}
            {onDrawingsClick && (
              <li>
                <a href="/drawings" style={{ ...linkBtn, textDecoration: 'none' }} onClick={(event) => { handleInternalNav(event, '/drawings'); onDrawingsClick(); }}>
                  <PencilRuler size={16} /> House Drawings
                </a>
              </li>
            )}
            {onChatClick && (
              <li>
                <button type="button" style={linkBtn} onClick={onChatClick}>
                  <MessageCircle size={16} /> Chat with DVS
                </button>
              </li>
            )}
            {onContactClick && (
              <li><button type="button" style={linkBtn} onClick={onContactClick}>Book Inspection</button></li>
            )}
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Hours</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {settings.operatingHours}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1120px', margin: '2.5rem auto 0', paddingTop: '1.25rem', borderTop: '1px solid var(--bg-glass-border)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.85rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div>© 2026 DVS Pest Control, Lucknow, Uttar Pradesh.</div>
        {onLoginClick && (
          <button
            type="button"
            onClick={onLoginClick}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
          >
            Staff login
          </button>
        )}
      </div>
    </footer>
  );
};
