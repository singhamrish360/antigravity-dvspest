import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PestBackgroundGame } from './PestBackgroundGame';
import { PestBrowseLinks } from './PestBrowseLinks';
import { PestCta } from './PestCta';
import { DRAWINGS_PAGE_CSS } from './drawingsStyles';
import { PHONE_DISPLAY, defaultPestWhatsappMessage, formatInr, whatsappQuoteLink } from '../../seo/constants';
import { PEST_ROUTES, PestRoute } from '../../seo/pest-routes';

const BHK_LABELS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK'];

const labelForPath = (path: string) => {
  if (path === '/drawings') return 'House drawings (AutoCAD 2D and 3D elevation)';
  const route = PEST_ROUTES.find((item) => item.path === path);
  return route ? route.h1 : path;
};

export const PestLandingPage: React.FC<{ route: PestRoute }> = ({ route }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOpenFaq(0);
  }, [route.path]);

  const waHref = whatsappQuoteLink(defaultPestWhatsappMessage(route.whatsappTopic));

  return (
    <>
      <PestBackgroundGame />
      <div
        className="page-content-over-game"
        style={{ maxWidth: '1120px', margin: '0 auto', padding: '3rem 1.5rem 3rem', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}
        lang={route.lang}
      >
        <style dangerouslySetInnerHTML={{ __html: DRAWINGS_PAGE_CSS }} />

        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
          <div className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>
            {route.kind === 'area'
              ? 'DVS Pest Control, Lucknow'
              : route.kind === 'builders'
                ? 'For builders and new buildings'
                : route.kind === 'hub'
                  ? 'Pest control in Lucknow'
                  : route.kind === 'segment'
                    ? 'Homes, shops and businesses in Lucknow'
                    : 'DVS Pest Control'}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '1rem', fontWeight: 800, lineHeight: 1.2 }}>{route.h1}</h1>
          {route.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 64)} style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: 1.7, marginBottom: '1rem', textAlign: 'left' }}>
              {paragraph}
            </p>
          ))}
          <div style={{ marginTop: '1.25rem' }}>
            <PestCta whatsappHref={waHref} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
            Call or WhatsApp {PHONE_DISPLAY} to book an inspection.
          </p>
        </div>

        {route.highlights && route.highlights.length > 0 && (
          <div className="glass-panel" style={{ padding: '2rem 1.5rem', background: '#ffffff' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.85rem' }}>What this service includes</h2>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', lineHeight: 1.6 }}>
              {route.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {route.bhkRates && (
          <div className="glass-panel" style={{ padding: '2rem 1.5rem', background: '#ffffff' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Published apartment rates</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              These {route.bhkRates.label} figures are taken from the Lucknow rate card on this website. The final price is confirmed after inspection.
              {route.startingRate ? ` The service card starting rate, where listed, is ${formatInr(route.startingRate)}.` : ''}
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '2px solid var(--bg-glass-border)' }}>
                    {BHK_LABELS.map((label) => (
                      <th key={label} style={{ padding: '0.85rem 0.75rem', fontWeight: 800, textAlign: 'center' }}>{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {route.bhkRates.amounts.map((amount, index) => (
                      <td key={BHK_LABELS[index]} style={{ padding: '0.85rem 0.75rem', textAlign: 'center', fontWeight: 700 }}>
                        {formatInr(amount)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {route.startingRate && !route.bhkRates && (
          <div className="glass-panel" style={{ padding: '2rem 1.5rem', background: '#ffffff' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Published starting rate</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              The service card lists a starting rate of {formatInr(route.startingRate)}. The final price is confirmed after inspection.
            </p>
          </div>
        )}

        {route.relatedPaths && route.relatedPaths.length > 0 && (
          <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>Related pages</h2>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: 1.6 }}>
              {route.relatedPaths.map((path) => (
                <li key={path}>
                  <a href={path} style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{labelForPath(path)}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>Frequently asked questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {route.faqs.map((faq, idx) => (
              <div key={faq.q} className="glass-panel" style={{ overflow: 'hidden', background: '#fff' }}>
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
        </div>

        <PestBrowseLinks currentPath={route.path} />

        <div className="glass-panel" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', background: '#ffffff' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Book an inspection in Lucknow</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            WhatsApp or call {PHONE_DISPLAY}. Or return to the{' '}
            <a href="/" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>pest control home page</a>.
          </p>
          <PestCta whatsappHref={waHref} />
        </div>
      </div>
    </>
  );
};
