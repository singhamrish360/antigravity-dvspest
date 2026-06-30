import React, { useState } from 'react';
import { Star, ChevronDown, ArrowRight, Activity, MapPin } from 'lucide-react';
import { store } from '../../core/store';

interface Props {
  onBookClick: () => void;
  onServicesClick: () => void;
}

export const HomePage: React.FC<Props> = ({ onBookClick, onServicesClick }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const services = store.getServices();
  const approvedFeedback = store.getFeedback().filter(f => f.status === 'Approved');

  const faqs = [
    {
      q: 'How fast can DVS Pest Control respond to residential or commercial properties in Lucknow?',
      a: 'Our Lucknow dispatch hub guarantees on-site technician arrival within 2 to 4 hours across Hazratganj, Gomti Nagar, Alambagh, Indira Nagar, and all surrounding UP zones.'
    },
    {
      q: 'Is your herbal cockroach gel treatment odorless and safe for kitchens?',
      a: 'Yes! Our herbal gel application for cockroaches control is 100% odorless, non-toxic, eco-friendly, and safe for children, pets, and commercial food preparation areas.'
    },
    {
      q: 'What does the 5-Year Subterranean Termites Barrier Warranty include?',
      a: 'Our Drill-Fill-Seal subterranean termite treatment comes with an unconditional 5-year written warranty certificate, including annual complimentary thermal moisture scans.'
    },
    {
      q: 'What types of fumigation services does DVS offer for industrial warehouses?',
      a: 'We specialize in Phosphine gas fumigation for food processing units, grain stores, and commercial warehouses in Lucknow & UP, providing full FSSAI and Plant Quarantine compliance certification.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem', position: 'relative' }}>
      
      {/* Drastically Populated Moving Pests Background Animation Layer with realistic styling */}
      <div className="pest-bg-overlay">
        {/* Cockroaches */}
        <div className="crawling-pest bug-cockroach pest-c1">🪳</div>
        <div className="crawling-pest bug-cockroach pest-c2">🪳</div>
        <div className="crawling-pest bug-cockroach pest-c3">🪳</div>

        {/* Rodents */}
        <div className="crawling-pest bug-rodent pest-r1">🐀</div>
        <div className="crawling-pest bug-rodent pest-r2">🐀</div>
        <div className="crawling-pest bug-rodent pest-r3">🐀</div>

        {/* Mosquitoes */}
        <div className="crawling-pest bug-mosquito pest-m1">🦟</div>
        <div className="crawling-pest bug-mosquito pest-m2">🦟</div>
        <div className="crawling-pest bug-mosquito pest-m3">🦟</div>

        {/* Termites */}
        <div className="crawling-pest bug-termite pest-t1">🐜</div>
        <div className="crawling-pest bug-termite pest-t2">🐜</div>
        <div className="crawling-pest bug-termite pest-t3">🐜</div>
        <div className="crawling-pest bug-termite pest-t4">🐜</div>
      </div>

      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '5rem 1.5rem', overflow: 'hidden', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-surface)', border: '1px solid var(--bg-glass-border)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', position: 'relative', zIndex: 3 }}>
          <div>
            <div className="badge badge-warning" style={{ marginBottom: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={14} /> Lucknow, UP Headquarters • Enterprise Infrastructure
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              DVS PEST CONTROL <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>INFRASTRUCTURE CO</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Specialized infrastructure pest defense against Cockroaches, Rodents, Mosquitoes, Termites, and Industrial Fumigation across Lucknow and Uttar Pradesh.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={onBookClick}>
                Book Inspection <ArrowRight size={20} />
              </button>
              <button className="btn btn-secondary btn-lg" onClick={onServicesClick}>
                Explore Solutions & Rates (₹)
              </button>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--bg-glass-border)' }}>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>100%</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Eradication Success</div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>12,000+</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Properties Treated</div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-primary)' }}>5 Years</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Termite Warranty</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: '#ffffff', boxShadow: 'var(--shadow-lg)' }}>
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="DVS Pest Control Inspection"
                style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
              />
              <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }} className="glass-panel">
                <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.95)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Activity size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Lucknow Dispatch Telemetry</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active pest control teams deployed in Hazratganj & Gomti Nagar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Matrix */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '0 1.5rem', position: 'relative', zIndex: 3 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Our Core Pest Services</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Tailored biological defense packages priced transparently in Indian Rupees (₹).
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {services.map(srv => (
            <div key={srv.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
              {srv.isPopular && <div className="badge badge-warning" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>Popular Service</div>}
              <img src={srv.imageUrl} alt={srv.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{srv.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', flexGrow: 1, lineHeight: 1.5 }}>
                {srv.description}
              </p>
              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--bg-glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>STARTING RATE</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent-primary)' }}>₹{srv.basePrice.toLocaleString()}</span>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={onBookClick}>
                  Book Inspection
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Approved Feedback Showcase */}
      <section style={{ background: 'var(--bg-secondary)', padding: '4rem 1.5rem', borderTop: '1px solid var(--bg-glass-border)', borderBottom: '1px solid var(--bg-glass-border)', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Verified Client Testimonials</div>
            <h2 style={{ fontSize: '2rem' }}>Trusted Across Lucknow & Uttar Pradesh</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {approvedFeedback.map(item => (
              <div key={item.id} className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#d97706' }}>
                  {[...Array(item.rating)].map((_, i) => <Star key={i} size={18} fill="#d97706" />)}
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.6, flexGrow: 1 }}>
                  "{item.comment}"
                </p>
                <div style={{ borderTop: '1px solid var(--bg-glass-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.customerName}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic FAQ Accordion */}
      <section style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: '0 1.5rem', position: 'relative', zIndex: 3 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Clear answers on our pest management protocols and Lucknow service coverage.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel" style={{ overflow: 'hidden', background: '#ffffff' }}>
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{ width: '100%', padding: '1.25rem 1.5rem', background: 'none', border: 'none', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              >
                <span>{faq.q}</span>
                <ChevronDown size={20} style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--transition-fast)', color: 'var(--accent-primary)' }} />
              </button>
              {openFaq === idx && (
                <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, borderTop: '1px solid var(--bg-glass-border)', paddingTop: '1rem' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
