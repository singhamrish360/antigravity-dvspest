import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { BlueprintBackgroundGame } from './BlueprintBackgroundGame';
import { DrawingsBrowseLinks } from './DrawingsBrowseLinks';
import { DrawingsCalculator } from './DrawingsCalculator';
import { DrawingsCredentials } from './DrawingsCredentials';
import { DrawingsCta } from './DrawingsCta';
import { DrawingsFaqList } from './DrawingsFaqList';
import { DrawingsGallery } from './DrawingsGallery';
import { DRAWINGS_PAGE_CSS } from './drawingsStyles';
import { PHONE_DISPLAY, defaultWhatsappMessage, whatsappQuoteLink } from '../../seo/constants';
import { SeoRoute } from '../../seo/routes';

export const DrawingsLandingPage: React.FC<{ route: SeoRoute }> = ({ route }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [route.path]);

  const waHref = whatsappQuoteLink(defaultWhatsappMessage(route.plotSqFt));

  return (
    <>
      <BlueprintBackgroundGame />
      <div className="page-content-over-game" style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3.5rem' }} lang={route.lang}>
        <style dangerouslySetInnerHTML={{ __html: DRAWINGS_PAGE_CSS }} />

        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
          <div className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>DVS House Drawings</div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800, lineHeight: 1.2 }}>{route.h1}</h1>
          {route.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: 1.7, marginBottom: '1rem', textAlign: 'left' }}>
              {paragraph}
            </p>
          ))}
          <div style={{ marginTop: '1.25rem' }}>
            <DrawingsCta whatsappHref={waHref} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
            WhatsApp your plot size or drawings for a quote.
          </p>
        </div>

        {route.vastuPoints && route.vastuPoints.length > 0 && (
          <div className="glass-panel" style={{ padding: '2rem 1.5rem', background: '#ffffff' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Commonly cited points for a {route.facing}-facing house</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              General, well-known Vastu guidance only. Not a site-specific study, and not a promise of any result.
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', lineHeight: 1.6 }}>
              {route.vastuPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        <DrawingsCalculator
          defaults={{
            lengthFt: route.plotWidthFt,
            widthFt: route.plotDepthFt,
            sqFt: route.plotSqFt,
            floors: route.exampleFloors ?? 1,
          }}
        />

        <DrawingsGallery />
        <DrawingsCredentials />
        <DrawingsFaqList faqs={route.faqs} />
        <DrawingsBrowseLinks currentPath={route.path} />

        <div className="glass-panel" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', background: '#ffffff' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            <Clock size={16} /> Ready in 10 days, anywhere in India
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Send your plot size or drawings for a quote</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            WhatsApp or call {PHONE_DISPLAY}. Or return to the{' '}
            <a href="/drawings" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>main drawings page</a>.
          </p>
          <DrawingsCta whatsappHref={waHref} />
        </div>
      </div>
    </>
  );
};
