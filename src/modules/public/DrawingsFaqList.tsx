import React from 'react';
import { FaqItem } from '../../seo/faqs';

export const DrawingsFaqList: React.FC<{ faqs: FaqItem[]; heading?: string }> = ({
  faqs,
  heading = 'Frequently asked questions',
}) => (
  <div>
    <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>{heading}</h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '860px', margin: '0 auto' }}>
      {faqs.map((faq) => (
        <div key={faq.q} className="glass-card" style={{ background: '#ffffff' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{faq.q}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
        </div>
      ))}
    </div>
  </div>
);
