import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { PHONE_DISPLAY, TEL_LINK } from '../../seo/constants';

interface Props {
  whatsappHref: string;
  size?: 'lg' | 'md';
}

export const DrawingsCta: React.FC<Props> = ({ whatsappHref, size = 'lg' }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn ${size === 'lg' ? 'btn-lg' : ''}`}
      style={{ textDecoration: 'none', background: '#16a34a', color: '#fff', border: '1px solid #15803d' }}
    >
      <MessageCircle size={18} /> WhatsApp {PHONE_DISPLAY}
    </a>
    <a
      href={TEL_LINK}
      className={`btn btn-outline ${size === 'lg' ? 'btn-lg' : ''}`}
      style={{ textDecoration: 'none' }}
    >
      <Phone size={18} /> Call {PHONE_DISPLAY}
    </a>
  </div>
);
