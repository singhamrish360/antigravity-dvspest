import React, { useState } from 'react';
import { ArrowRight, MessageCircle, MapPin, Phone, PencilRuler, Clock, ShieldCheck, BadgeIndianRupee, ChevronDown } from 'lucide-react';
import { store } from '../../core/store';
import { PestBackgroundGame } from './PestBackgroundGame';

interface Props {
  onBookClick: () => void;
  onServicesClick: () => void;
  onChatClick?: () => void;
  onDrawingsClick?: () => void;
}

const PHONE_DISPLAY = '+91 93304 78897';
const PHONE_TEL = 'tel:+919330478897';
const WHATSAPP_URL = 'https://wa.me/919330478897';

export const HomePage: React.FC<Props> = ({ onBookClick, onServicesClick, onChatClick, onDrawingsClick }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const services = store.getServices();

  const faqs = [
    {
      q: 'How fast can DVS Pest Control respond in Lucknow?',
      a: 'We offer a quick response across Lucknow, including Hazratganj, Gomti Nagar, Alambagh, Indira Nagar and surrounding areas. Call or WhatsApp to book an inspection.'
    },
    {
      q: 'Is your herbal cockroach gel treatment odorless and safe for kitchens?',
      a: 'Yes. Our herbal gel application for cockroach control is described as odorless and suitable for kitchens, children and pets. Please tell us about any specific concerns when you book.'
    },
    {
      q: 'What does the 5-year subterranean termite warranty include?',
      a: 'The drill-fill-seal subterranean termite treatment is offered with a 5-year written warranty, including annual inspection checks.'
    },
    {
      q: 'What types of fumigation services does DVS offer for industrial warehouses?',
      a: 'We offer fumigation for food processing units, grain stores and commercial warehouses in Lucknow and Uttar Pradesh. Ask us about the certificates needed for your site when you enquire.'
    }
  ];

  const serviceImageStyle = (id: string): React.CSSProperties => ({
    width: '100%',
    height: '180px',
    borderRadius: 'var(--radius-sm)',
    marginBottom: '1.25rem',
    backgroundImage: 'url(/services-grid.jpg)',
    backgroundSize: '200% 200%',
    backgroundPosition:
      id === 'SRV-101' ? '0% 0%' :
      id === 'SRV-102' ? '100% 0%' :
      id === 'SRV-103' || id === 'SRV-105' ? '0% 100%' :
      '100% 100%',
    backgroundRepeat: 'no-repeat',
    border: '1px solid var(--bg-glass-border)'
  });

  return (
    <>
    <PestBackgroundGame />
    <div className="home-page page-content-over-game" style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', padding: '0 0 3rem' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .home-wrap { max-width: 1120px; margin: 0 auto; width: 100%; padding: 0 1.25rem; }
        .home-hero {
          padding: 3rem 1.25rem 2.5rem;
        }
        .home-hero-inner {
          max-width: 1120px;
          margin: 0 auto;
          display: grid;
          gap: 2rem;
        }
        .home-hero h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0 0 1rem;
        }
        .home-hero-lead {
          font-size: 1.1rem;
          color: var(--text-secondary);
          line-height: 1.65;
          max-width: 38rem;
          margin-bottom: 1.75rem;
        }
        .home-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .home-offer-grid {
          display: grid;
          gap: 1rem;
        }
        .home-why-grid,
        .home-areas-grid,
        .home-services-grid {
          display: grid;
          gap: 1.25rem;
        }
        .home-services-grid {
          grid-template-columns: 1fr;
        }
        @media (max-width: 899px) {
          .home-cta-desktop { display: none !important; }
        }
        @media (min-width: 700px) {
          .home-offer-grid { grid-template-columns: 1fr 1fr; }
          .home-why-grid { grid-template-columns: repeat(2, 1fr); }
          .home-areas-grid { grid-template-columns: repeat(3, 1fr); }
          .home-services-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .home-hero-inner { grid-template-columns: 1.15fr 0.85fr; align-items: center; gap: 3rem; }
          .home-why-grid { grid-template-columns: repeat(4, 1fr); }
          .home-areas-grid { grid-template-columns: repeat(4, 1fr); }
          .home-services-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}} />

      <section className="home-hero">
        <div className="home-hero-inner">
          <div>
            <div className="badge badge-warning" style={{ marginBottom: '1.1rem' }}>
              <MapPin size={14} /> Lucknow, Uttar Pradesh
            </div>
            <h1>
              Pest control for homes and businesses in Lucknow
            </h1>
            <p className="home-hero-lead">
              DVS Pest Control treats cockroaches, termites, rodents, mosquitoes and does warehouse fumigation. Rates are listed on the site. Call or WhatsApp to book an inspection.
            </p>
            <div className="home-cta-row">
              <button className="btn btn-primary btn-lg" onClick={onBookClick}>
                Book Inspection <ArrowRight size={18} />
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg home-cta-desktop"
                style={{ textDecoration: 'none', background: '#16a34a', color: '#fff', border: '1px solid #15803d' }}
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
              <a href={PHONE_TEL} className="btn btn-outline btn-lg home-cta-desktop" style={{ textDecoration: 'none' }}>
                <Phone size={18} /> Call {PHONE_DISPLAY}
              </a>
              <button className="btn btn-secondary btn-lg" onClick={onServicesClick}>
                View rates
              </button>
            </div>
          </div>

          {onDrawingsClick && (
            <button
              type="button"
              onClick={onDrawingsClick}
              className="glass-card"
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                border: '1px solid var(--bg-glass-border)',
                background: '#fff',
                width: '100%'
              }}
            >
              <span className="badge badge-info" style={{ marginBottom: '0.85rem' }}>Also from DVS</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.6rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <PencilRuler size={18} />
                </div>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>House Drawings</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                2D AutoCAD plans, including plumbing and electrical, at ₹6 per sq ft. 3D front elevation for a flat ₹6,000. Delivered online anywhere in India in 10 days.
              </p>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                See drawings and sample work <ArrowRight size={16} />
              </span>
            </button>
          )}
        </div>
      </section>

      <section className="home-wrap">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>Our pest control services</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '36rem', margin: '0 auto' }}>
            Treatment packages with starting rates for homes and commercial properties in Lucknow.
          </p>
        </div>
        <div className="home-services-grid">
          {services.map(srv => (
            <div key={srv.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
              {srv.isPopular && <div className="badge badge-warning" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>Popular</div>}
              <div style={serviceImageStyle(srv.id)} role="img" aria-label={srv.title} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{srv.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.1rem', flexGrow: 1, lineHeight: 1.55 }}>
                {srv.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginTop: 'auto' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Starting rate</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent-primary)' }}>
                    ₹{srv.basePrice.toLocaleString('en-IN')}
                  </div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={onBookClick}>Book Inspection</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <button className="btn btn-primary" onClick={onServicesClick}>
            Full rate card <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="home-wrap">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>Why book with DVS</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Clear prices, a Lucknow team, and a direct way to get in touch.</p>
        </div>
        <div className="home-why-grid">
          {[
            { icon: MapPin, title: 'Based in Lucknow', body: 'We serve homes and businesses across Lucknow and Uttar Pradesh.' },
            { icon: BadgeIndianRupee, title: 'Published rates', body: 'Pest control prices are listed by service and by BHK. House drawings are ₹6 per sq ft, or ₹6,000 for a 3D front elevation.' },
            { icon: Clock, title: 'Open all week', body: 'Monday to Sunday, 8:00 AM to 9:00 PM. Call or WhatsApp +91 93304 78897.' },
            { icon: ShieldCheck, title: 'Termite warranty', body: 'The subterranean termite treatment is offered with a 5-year written warranty.' },
          ].map(item => (
            <div key={item.title} className="glass-card" style={{ background: '#fff' }}>
              <item.icon size={22} color="var(--accent-primary)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-wrap">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>Areas we serve in Lucknow</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '36rem', margin: '0 auto' }}>
            Pest control for these localities, and nearby areas across Lucknow.
          </p>
        </div>
        <div className="home-areas-grid">
          {[
            'Gomti Nagar', 'Hazratganj', 'Indira Nagar', 'Alambagh',
            'Jankipuram', 'Mahanagar', 'Ashiyana', 'Vikas Nagar',
            'Chowk', 'Charbagh', 'Chinhat', 'Vrindavan Yojna'
          ].map(loc => (
            <div key={loc} className="glass-panel" style={{ padding: '1rem 1rem', textAlign: 'center', background: '#fff' }}>
              <div style={{ fontWeight: 700 }}>{loc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '0 1.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>Frequently asked questions</h2>
          <p style={{ color: 'var(--text-secondary)' }}>About pest control in Lucknow.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel" style={{ overflow: 'hidden', background: '#fff' }}>
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{ width: '100%', padding: '1.1rem 1.25rem', background: 'none', border: 'none', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', gap: '1rem' }}
              >
                <span>{faq.q}</span>
                <ChevronDown size={20} style={{ flexShrink: 0, transform: openFaq === idx ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition-fast)', color: 'var(--accent-primary)' }} />
              </button>
              {openFaq === idx && (
                <div style={{ padding: '0 1.25rem 1.15rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, borderTop: '1px solid var(--bg-glass-border)', paddingTop: '0.9rem' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {onChatClick && (
        <section className="home-wrap" style={{ textAlign: 'center' }}>
          <div className="glass-card" style={{ background: '#fff', padding: '2rem 1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Prefer to talk it through?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Chat with DVS, or call {PHONE_DISPLAY}.
            </p>
            <div className="home-cta-row" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={onChatClick}>
                <MessageCircle size={16} /> Chat with DVS
              </button>
              <button className="btn btn-secondary" onClick={onBookClick}>Book Inspection</button>
            </div>
          </div>
        </section>
      )}
    </div>
    </>
  );
};