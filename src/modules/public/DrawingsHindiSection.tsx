import React from 'react';
import { PHONE_DISPLAY, formatInr, ELEVATION_FLAT_FEE, RATE_PER_SQFT } from '../../seo/constants';

export const DrawingsHindiSection: React.FC = () => (
  <section lang="hi" className="glass-panel" style={{ padding: '2rem 1.5rem', background: '#ffffff' }}>
    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>घर का नक्शा / मकान का नक्शा</h2>
    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0.85rem' }}>
      अपना घर का नक्शा या मकान का नक्शा अब ऑनलाइन बनवा सकते हैं। 2D AutoCAD प्लान, सेक्शन और एलिवेशन — प्लंबिंग और विद्युत लेआउट सहित — {formatInr(RATE_PER_SQFT)} प्रति वर्ग फुट।
      3D फ्रंट एलिवेशन किसी भी साइज़ के लिए {formatInr(ELEVATION_FLAT_FEE)} का एक फ्लैट शुल्क है। तैयार फाइलें DWG और PDF में 10 दिन में पूरे भारत में भेज दी जाती हैं।
    </p>
    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
      Ghar ka naksha ya makan ka naksha ke liye plot ka size WhatsApp kijiye — length aur width, ya square feet — aur kitni floor banani hai. 2 se 3 bade aur 4 se 5 chhote sanshodhan shulk mein shamil hain.
      Baat Hindi, English ya Hinglish mein ho sakti hai. Call ya WhatsApp: {PHONE_DISPLAY}.
    </p>
    <a href="/drawings/ghar-ka-naksha" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
      घर का नक्शा वाले पूरे पेज पर जाएँ →
    </a>
  </section>
);
