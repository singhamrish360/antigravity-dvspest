import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { PHONE_DISPLAY, TEL_LINK } from '../../seo/constants';

export const PestCta: React.FC<{ whatsappHref: string; align?: 'center' | 'left' }> = ({
  whatsappHref,
  align = 'center',
}) => (
  <div className="home-cta-row" style={{ justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-lg"
      style={{ textDecoration: 'none', background: '#16a34a', color: '#fff', border: '1px solid #15803d' }}
    >
      <MessageCircle size={18} /> WhatsApp
    </a>
    <a href={TEL_LINK} className="btn btn-outline btn-lg" style={{ textDecoration: 'none' }}>
      <Phone size={18} /> Call {PHONE_DISPLAY}
    </a>
  </div>
);
