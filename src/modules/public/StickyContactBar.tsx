import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

const PHONE_TEL = 'tel:+919330478897';
const WHATSAPP_URL = 'https://wa.me/919330478897';

export const StickyContactBar: React.FC = () => {
  return (
    <div className="sticky-contact-bar" aria-label="Quick contact">
      <style dangerouslySetInnerHTML={{ __html: `
        .sticky-contact-bar {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 250;
          display: flex;
          gap: 0.5rem;
          padding: 0.65rem 0.85rem calc(0.65rem + env(safe-area-inset-bottom));
          background: rgba(255, 255, 255, 0.97);
          border-top: 1px solid var(--bg-glass-border);
          box-shadow: 0 -8px 24px rgba(184, 150, 105, 0.12);
        }
        .sticky-contact-bar a {
          text-decoration: none;
          flex: 1;
          justify-content: center;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
        }
        @media (min-width: 900px) {
          .sticky-contact-bar {
            left: 1.25rem;
            right: auto;
            bottom: 1.25rem;
            width: auto;
            border: 1px solid var(--bg-glass-border);
            border-radius: 999px;
            padding: 0.4rem;
            box-shadow: var(--shadow-lg);
          }
          .sticky-contact-bar a {
            flex: 0 0 auto;
            padding: 0.65rem 1.1rem;
            font-size: 0.9rem;
          }
        }
      `}} />
      <a href={PHONE_TEL} className="btn btn-outline btn-sm">
        <Phone size={16} /> Call
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm"
        style={{ background: '#16a34a', color: '#fff', border: '1px solid #15803d' }}
      >
        <MessageCircle size={16} /> WhatsApp
      </a>
    </div>
  );
};
