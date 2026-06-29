import React, { useState } from 'react';
import { Shield, Sparkles, CheckCircle2, Star, ChevronDown, ArrowRight, Activity, Award, Users, Cpu, Clock } from 'lucide-react';
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
      q: 'How fast can an emergency inspection team respond to commercial premises?',
      a: 'Our cloud-dispatched technician pipeline guarantees on-site response within 2 to 4 hours for commercial emergency contracts across all covered metropolitan zones.'
    },
    {
      q: 'Are your botanical chemical formulations safe for hospitals and food facilities?',
      a: 'Yes. We deploy EPA List N registered non-repellent bio-foam formulations specifically engineered for zero-residue, touch-dry reentry within 30 minutes, meeting strict OSHA and FDA compliance standards.'
    },
    {
      q: 'What is the 5-Year Termite Subterranean Warranty protection plan?',
      a: 'Our liquid trenching barrier and digital interception bait stations come with an unconditional 5-year structural warranty, including complimentary annual thermal imaging diagnostic sweeps.'
    },
    {
      q: 'Can business logic and pricing schedules be configured via the Administrator Dashboard?',
      a: 'All service offerings, pricing matrix rules, AMC schedules, and automated email trigger workflows are 100% configurable via our SaaS Admin Dashboard with zero code modifications required.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem' }}>
      
      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '5rem 1.5rem', overflow: 'hidden', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-surface)', border: '1px solid var(--bg-glass-border)' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div className="badge badge-purple" style={{ marginBottom: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} /> Next-Gen Enterprise AI SaaS Ecosystem
            </div>
            <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              Autonomous Property Defense & <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Smart Pest Extermination</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Automating customer engagement, thermal computer vision diagnostics, real-time dispatch, and compliance tracking for commercial and residential ecosystems.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={onBookClick}>
                Book Consultation <ArrowRight size={20} />
              </button>
              <button className="btn btn-secondary btn-lg" onClick={onServicesClick}>
                Explore Solutions Matrix
              </button>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--bg-glass-border)' }}>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>99.9%</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Eradication Accuracy</div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>5,000+</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Properties Defended</div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-info)' }}>&lt; 1 sec</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI Diagnosis Speed</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="Smart Enterprise Inspection"
                style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
              />
              <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }} className="glass-panel">
                <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Activity size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Thermal Acoustic Telemetry Active</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sub-surface pest activity scanning online</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Matrix */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Enterprise Solutions Matrix</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Multi-layered biological defense and structural preservation protocols tailored for every property scale.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {services.map(srv => (
            <div key={srv.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {srv.isPopular && <div className="badge badge-purple" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>Popular Solution</div>}
              <img src={srv.imageUrl} alt={srv.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{srv.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', flexGrow: 1, lineHeight: 1.5 }}>
                {srv.description}
              </p>
              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--bg-glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>STARTING FROM</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--accent-primary)' }}>${srv.basePrice}</span>
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
      <section style={{ background: 'var(--bg-secondary)', padding: '4rem 1.5rem', borderTop: '1px solid var(--bg-glass-border)', borderBottom: '1px solid var(--bg-glass-border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Verified Client Testimonials</div>
            <h2 style={{ fontSize: '2rem' }}>Trusted by Enterprise Operations</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {approvedFeedback.map(item => (
              <div key={item.id} className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
                  {[...Array(item.rating)].map((_, i) => <Star key={i} size={18} fill="#fbbf24" />)}
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.6, flexGrow: 1 }}>
                  "{item.comment}"
                </p>
                <div style={{ borderTop: '1px solid var(--bg-glass-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.customerName}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic FAQ Accordion */}
      <section style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Clear answers on our autonomous inspection protocols and compliance framework.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel" style={{ overflow: 'hidden', transition: 'all var(--transition-fast)' }}>
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
