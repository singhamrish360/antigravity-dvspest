import React, { useEffect } from 'react';
import { Box, Check, Clock, FileText, MessageCircle, PencilRuler, RefreshCw, Send } from 'lucide-react';
import { BlueprintBackgroundGame } from './BlueprintBackgroundGame';
import { DrawingsBrowseLinks } from './DrawingsBrowseLinks';
import { DrawingsCalculator } from './DrawingsCalculator';
import { DrawingsCredentials } from './DrawingsCredentials';
import { DrawingsCta } from './DrawingsCta';
import { DrawingsFaqList } from './DrawingsFaqList';
import { DrawingsGallery } from './DrawingsGallery';
import { DrawingsHindiSection } from './DrawingsHindiSection';
import { DRAWINGS_PAGE_CSS } from './drawingsStyles';
import {
  ELEVATION_FLAT_FEE,
  EXAMPLE_SQFT,
  PHONE_DISPLAY,
  RATE_PER_SQFT,
  defaultWhatsappMessage,
  formatInr,
  whatsappQuoteLink,
} from '../../seo/constants';
import { DRAWINGS_HUB } from '../../seo/routes';

const included2d = ['Floor plans', 'Sections', 'Elevations', 'Plumbing layouts', 'Electrical layouts'];

const steps = [
  { icon: Send, title: 'Send your plot size or drawings', body: 'WhatsApp your plot size in sq ft, or your existing drawings if you only need a 3D front elevation.' },
  { icon: PencilRuler, title: 'We draft in AutoCAD', body: 'We prepare the 2D plans, sections and elevations, including plumbing and electrical, or the 3D front elevation.' },
  { icon: RefreshCw, title: 'Review and revise', body: 'You review the draft. Up to 2 to 3 major changes and 4 to 5 minor changes are included.' },
  { icon: FileText, title: 'Final files in 10 days', body: 'You receive the finished drawings as DWG and PDF files, delivered online anywhere in India.' },
];

export const DrawingsPage: React.FC = () => {
  const waHref = whatsappQuoteLink(defaultWhatsappMessage(EXAMPLE_SQFT));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <BlueprintBackgroundGame />
      <div className="page-content-over-game" style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        <style dangerouslySetInnerHTML={{ __html: DRAWINGS_PAGE_CSS }} />

        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
          <div className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>DVS House Drawings</div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800, lineHeight: 1.2 }}>
            {DRAWINGS_HUB.h1}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Online AutoCAD drafting for residential homes and buildings. 2D plans, sections and elevations with plumbing and electrical at {formatInr(RATE_PER_SQFT)} per sq ft, or a 3D front elevation for a flat {formatInr(ELEVATION_FLAT_FEE)}.
          </p>
          <DrawingsCta whatsappHref={waHref} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
            WhatsApp your plot size or drawings for a quote.
          </p>
        </div>

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
              {['3D front elevation only', 'Available when you already have drawings', 'Same price for any size'].map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={16} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} /> {item}
                </li>
              ))}
            </ul>
            <a href={whatsappQuoteLink(defaultWhatsappMessage())} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: 'none', width: '100%' }}>
              <MessageCircle size={16} /> Send drawings for 3D
            </a>
          </div>
        </div>

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

        <DrawingsGallery intro="A completed house drawing set: a 3D front elevation, ground floor plan, front elevation and section. Tap any image to enlarge it." />

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

        <DrawingsCalculator defaults={{ sqFt: EXAMPLE_SQFT, floors: 1 }} />
        <DrawingsHindiSection />
        <DrawingsCredentials />
        <DrawingsFaqList faqs={DRAWINGS_HUB.faqs} />
        <DrawingsBrowseLinks currentPath="/drawings" />

        <div className="glass-panel" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', background: '#ffffff' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            <Clock size={16} /> Ready in 10 days, anywhere in India
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Send your plot size or drawings for a quote</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            WhatsApp or call {PHONE_DISPLAY}.
          </p>
          <DrawingsCta whatsappHref={waHref} />
        </div>
      </div>
    </>
  );
};
