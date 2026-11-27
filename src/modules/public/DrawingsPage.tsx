import React, { useEffect, useMemo, useState } from 'react';
import { Calculator, Check, Clock, FileText, MessageCircle, Phone, PencilRuler, RefreshCw, Send, Box, X } from 'lucide-react';
import { BlueprintBackgroundGame } from './BlueprintBackgroundGame';

const PHONE_DISPLAY = '+91 93304 78897';
const WA_BASE = 'https://wa.me/919330478897';
const TEL_LINK = 'tel:+919330478897';
const RATE_PER_SQFT = 6;
const ELEVATION_FLAT_FEE = 6000;
const EXAMPLE_SQFT = 1500;

const PAGE_TITLE = 'House Plan & 3D Elevation Drawing Services in India | DVS';
const PAGE_DESCRIPTION = '2D AutoCAD house plans, sections and elevations with plumbing and electrical layouts at ₹6 per sq ft, or a 3D front elevation for a flat ₹6,000. Delivered online anywhere in India in 10 days.';

const formatInr = (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

const whatsappLink = (sqFt?: number) => {
  const sizeNote = sqFt && sqFt > 0 ? ` My plot size is ${sqFt.toLocaleString('en-IN')} sq ft.` : ' My plot size is ___ sq ft.';
  const text = `Hi DVS, I would like a quote for house drawings.${sizeNote}`;
  return `${WA_BASE}?text=${encodeURIComponent(text)}`;
};


const SAMPLE_WORK = [
  {
    src: '/drawings/sample-3d-front-elevation.webp',
    title: '3D front elevation',
    alt: '3D front elevation of a residence, prepared as a sample of DVS drawing work',
    featured: true,
  },
  {
    src: '/drawings/sample-ground-floor-plan.webp',
    title: 'Ground floor plan',
    alt: 'Ground floor plan from a sample AutoCAD house drawing set',
  },
  {
    src: '/drawings/sample-front-elevation.webp',
    title: 'Front elevation',
    alt: 'Front elevation drawing from a sample AutoCAD house drawing set',
  },
  {
    src: '/drawings/sample-section.webp',
    title: 'Section',
    alt: 'Building section from a sample AutoCAD house drawing set',
  },
] as const;

export const DrawingsPage: React.FC = () => {
  const [sqFtInput, setSqFtInput] = useState(String(EXAMPLE_SQFT));
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const parsedSqFt = useMemo(() => {
    const n = Number(sqFtInput.replace(/,/g, ''));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [sqFtInput]);
  const estimate = parsedSqFt * RATE_PER_SQFT;
  const waHref = whatsappLink(parsedSqFt || undefined);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxIndex]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const upsertMeta = (selector: string, attr: string, value: string, createAttrs: Record<string, string>) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      const previous = el?.getAttribute(attr) ?? null;
      if (!el) {
        el = document.createElement('meta');
        Object.entries(createAttrs).forEach(([k, v]) => el!.setAttribute(k, v));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
      return () => {
        if (previous === null) {
          el?.remove();
        } else {
          el?.setAttribute(attr, previous);
        }
      };
    };

    const restorers = [
      upsertMeta('meta[name="description"]', 'content', PAGE_DESCRIPTION, { name: 'description' }),
      upsertMeta('meta[property="og:title"]', 'content', PAGE_TITLE, { property: 'og:title' }),
      upsertMeta('meta[property="og:description"]', 'content', PAGE_DESCRIPTION, { property: 'og:description' }),
    ];

    return () => {
      document.title = previousTitle;
      restorers.forEach((restore) => restore());
    };
  }, []);

  const included2d = [
    'Floor plans',
    'Sections',
    'Elevations',
    'Plumbing layouts',
    'Electrical layouts',
  ];

  const steps = [
    { icon: Send, title: 'Send your plot size or drawings', body: 'WhatsApp your plot size in sq ft, or your existing drawings if you only need a 3D front elevation.' },
    { icon: PencilRuler, title: 'We draft in AutoCAD', body: 'We prepare the 2D plans, sections and elevations, including plumbing and electrical, or the 3D front elevation.' },
    { icon: RefreshCw, title: 'Review and revise', body: 'You review the draft. Up to 2 to 3 major changes and 4 to 5 minor changes are included.' },
    { icon: FileText, title: 'Final files in 10 days', body: 'You receive the finished drawings as DWG and PDF files, delivered online anywhere in India.' },
  ];

  const faqs = [
    {
      q: 'What information should I send?',
      a: 'WhatsApp your plot size in sq ft for a 2D quote, or your existing drawings if you only need a 3D front elevation. You can also share any other notes you have, such as the number of floors.',
    },
    {
      q: 'Which file formats will I receive?',
      a: 'Final drawings are delivered as DWG and PDF files.',
    },
    {
      q: 'How does payment work?',
      a: `WhatsApp or call ${PHONE_DISPLAY} for a quote. We will share payment details with you before the drafting work starts.`,
    },
    {
      q: 'How many revisions are included?',
      a: 'The fee includes up to 2 to 3 major changes and up to 4 to 5 minor changes.',
    },
  ];

  const CtaButtons = ({ size = 'lg' as 'lg' | 'md' }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
      <a
        href={waHref}
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

  return (
    <>
    <BlueprintBackgroundGame />
    <div className="page-content-over-game" style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .drawings-pricing-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .drawings-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .drawings-calc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: center;
        }
        .drawings-gallery-feature {
          display: flex;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .drawings-gallery-sheets {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .drawings-gallery-item {
          background: #ffffff;
          cursor: pointer;
          padding: 0;
          overflow: hidden;
          text-align: left;
          width: 100%;
          font: inherit;
          color: inherit;
          appearance: none;
          border: 1px solid var(--bg-glass-border);
        }
        .drawings-gallery-item img {
          display: block;
          width: 100%;
          height: auto;
          background: #ffffff;
        }
        .drawings-gallery-item figcaption,
        .drawings-gallery-item .caption {
          padding: 0.85rem 1rem 1rem;
          font-weight: 600;
          font-size: 0.95rem;
        }
        .drawings-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(28, 22, 16, 0.84);
          z-index: 80;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .drawings-lightbox img {
          max-width: min(1100px, 100%);
          max-height: calc(100vh - 7rem);
          width: auto;
          height: auto;
          object-fit: contain;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
        }
        @media (max-width: 768px) {
          .drawings-pricing-grid,
          .drawings-calc-grid {
            grid-template-columns: 1fr;
          }
          .drawings-steps-grid,
          .drawings-gallery-sheets {
            grid-template-columns: 1fr;
          }
        }
      `}} />

      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
        <div className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>DVS House Drawings</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800, lineHeight: 1.2 }}>
          House Plans, Elevations and 3D Front Designs, Delivered Anywhere in India in 10 Days
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          Online AutoCAD drafting for residential homes and buildings. 2D plans, sections and elevations with plumbing and electrical at {formatInr(RATE_PER_SQFT)} per sq ft, or a 3D front elevation for a flat {formatInr(ELEVATION_FLAT_FEE)}.
        </p>
        <CtaButtons />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
          WhatsApp your plot size or drawings for a quote.
        </p>
      </div>

      {/* Pricing cards */}
      <div className="drawings-pricing-grid">
        <div className="glass-card" style={{ background: '#ffffff', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <span className="badge badge-warning" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>2D AutoCAD</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <PencilRuler size={22} />
            </div>
            <h2 style={{ fontSize: '1.45rem', margin: 0 }}>2D Plans, Sections & Elevations</h2>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2.4rem', color: 'var(--accent-primary)', margin: '0.5rem 0 0.25rem' }}>
            {formatInr(RATE_PER_SQFT)} <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>per sq ft</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Complete 2D AutoCAD drawings for homes and buildings, including plumbing and electrical layouts. Example: {EXAMPLE_SQFT.toLocaleString('en-IN')} sq ft = {formatInr(EXAMPLE_SQFT * RATE_PER_SQFT)}.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '1.5rem', flexGrow: 1 }}>
            {included2d.map((item) => (
              <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={16} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} /> {item}
              </li>
            ))}
          </ul>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: 'none', width: '100%' }}>
            <MessageCircle size={16} /> Get a 2D quote
          </a>
        </div>

        <div className="glass-card" style={{ background: '#ffffff', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <span className="badge badge-success" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>3D Elevation</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-secondary) 0%, #10b981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <Box size={22} />
            </div>
            <h2 style={{ fontSize: '1.45rem', margin: 0 }}>3D Front Elevation</h2>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2.4rem', color: 'var(--accent-primary)', margin: '0.5rem 0 0.25rem' }}>
            {formatInr(ELEVATION_FLAT_FEE)} <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>flat fee</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            A 3D front elevation from your existing drawings, at a flat {formatInr(ELEVATION_FLAT_FEE)} for any size.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '1.5rem', flexGrow: 1 }}>
            {[
              '3D front elevation only',
              'Available when you already have drawings',
              'Same price for any size',
            ].map((item) => (
              <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={16} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} /> {item}
              </li>
            ))}
          </ul>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: 'none', width: '100%' }}>
            <MessageCircle size={16} /> Send drawings for 3D
          </a>
        </div>
      </div>

      {/* What's included */}
      <div className="glass-panel" style={{ padding: '2.5rem', background: '#ffffff' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', textAlign: 'center' }}>What is included</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
          The 2D package covers the full drawing set for residential homes and buildings. The 3D option is a front elevation only, when you already have drawings.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { title: '2D AutoCAD set', body: 'Plans, sections and elevations for homes and buildings.' },
            { title: 'Plumbing & electrical', body: 'Layouts for both are included in the 2D package at no extra per-sq-ft charge.' },
            { title: '3D front elevation', body: `Flat ${formatInr(ELEVATION_FLAT_FEE)} at any size, from your existing drawings.` },
            { title: 'Online, pan-India', body: 'The service is fully online and available anywhere in India.' },
          ].map((item) => (
            <div key={item.title} style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.55 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sample work */}
      <div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', textAlign: 'center' }}>Sample work</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
          A completed house drawing set: a 3D front elevation, ground floor plan, front elevation and section. Tap any image to enlarge it.
        </p>
        <div className="drawings-gallery-feature">
          <button
            type="button"
            className="glass-card drawings-gallery-item"
            onClick={() => setLightboxIndex(0)}
            style={{ maxWidth: '420px' }}
            aria-label="View 3D front elevation larger"
          >
            <img src={SAMPLE_WORK[0].src} alt={SAMPLE_WORK[0].alt} />
            <div className="caption">{SAMPLE_WORK[0].title}</div>
          </button>
        </div>
        <div className="drawings-gallery-sheets">
          {SAMPLE_WORK.slice(1).map((item, index) => (
            <button
              type="button"
              key={item.src}
              className="glass-card drawings-gallery-item"
              onClick={() => setLightboxIndex(index + 1)}
              aria-label={`View ${item.title} larger`}
            >
              <img src={item.src} alt={item.alt} />
              <div className="caption">{item.title}</div>
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="drawings-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={SAMPLE_WORK[lightboxIndex].title}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close image"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '44px',
              height: '44px',
              borderRadius: '999px',
              border: 'none',
              background: '#ffffff',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <X size={20} />
          </button>
          <div onClick={(event) => event.stopPropagation()} style={{ textAlign: 'center' }}>
            <img src={SAMPLE_WORK[lightboxIndex].src} alt={SAMPLE_WORK[lightboxIndex].alt} />
            <p style={{ color: '#faf8f5', marginTop: '0.85rem', fontWeight: 600 }}>
              {SAMPLE_WORK[lightboxIndex].title}
            </p>
          </div>
        </div>
      )}

      {/* How it works */}
      <div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>How it works</h2>
        <div className="drawings-steps-grid">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="glass-card" style={{ background: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} />
                  </div>
                  <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>Step {index + 1}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.55 }}>{step.body}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revisions */}
      <div className="glass-panel" style={{ padding: '2.5rem', background: 'var(--gradient-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <RefreshCw size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Revisions policy</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
              Each job includes up to 2 to 3 major changes and up to 4 to 5 minor changes. Delivery is in 10 days.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-surface)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="badge badge-success" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calculator size={14} /> 2D price calculator
          </div>
          <h2 style={{ fontSize: '2rem' }}>Estimate your 2D drawing fee</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Enter your plot size in sq ft. The 2D fee is area × {formatInr(RATE_PER_SQFT)}.
          </p>
        </div>

        <div className="drawings-calc-grid" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div>
            <div className="form-group">
              <label className="form-label" htmlFor="drawings-sqft">Area in sq ft</label>
              <input
                id="drawings-sqft"
                className="form-control"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={sqFtInput}
                onChange={(e) => setSqFtInput(e.target.value)}
                placeholder="e.g. 1500"
              />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Example: {EXAMPLE_SQFT.toLocaleString('en-IN')} sq ft × {formatInr(RATE_PER_SQFT)} = {formatInr(EXAMPLE_SQFT * RATE_PER_SQFT)}. The 3D front elevation is a flat {formatInr(ELEVATION_FLAT_FEE)} and is not calculated here.
            </p>
          </div>

          <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', background: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>ESTIMATED 2D FEE</span>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2.8rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
              {parsedSqFt > 0 ? formatInr(estimate) : '—'}
            </div>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
              WhatsApp this quote
            </a>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>Frequently asked questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '860px', margin: '0 auto' }}>
          {faqs.map((faq) => (
            <div key={faq.q} className="glass-card" style={{ background: '#ffffff' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{faq.q}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing CTA */}
      <div className="glass-panel" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', background: '#ffffff' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
          <Clock size={16} /> Ready in 10 days, anywhere in India
        </div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Send your plot size or drawings for a quote</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          WhatsApp or call {PHONE_DISPLAY}.
        </p>
        <CtaButtons />
      </div>
    </div>
    </>
  );
};