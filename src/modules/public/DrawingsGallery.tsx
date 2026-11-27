import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { SAMPLE_WORK } from '../../seo/gallery';

export const DrawingsGallery: React.FC<{ heading?: string; intro?: string }> = ({
  heading = 'Sample work',
  intro = 'A 3D front elevation, a ground floor plan, a front elevation and a section from a sample AutoCAD set. The title block has been cropped. These are shown so you can see the drawing style; they are not a plan to build from as-is.',
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const featured = SAMPLE_WORK.find((item) => item.featured) ?? SAMPLE_WORK[0];
  const featuredIndex = SAMPLE_WORK.indexOf(featured);
  const sheets = SAMPLE_WORK.filter((item) => item !== featured);

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

  return (
    <div>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', textAlign: 'center' }}>{heading}</h2>
      {intro && (
        <p style={{ color: 'var(--text-secondary)', maxWidth: '760px', margin: '0 auto 1.5rem', textAlign: 'center', lineHeight: 1.6 }}>
          {intro}
        </p>
      )}
      <div className="drawings-gallery-feature">
        <button
          type="button"
          className="glass-card drawings-gallery-item"
          onClick={() => setLightboxIndex(featuredIndex)}
          style={{ maxWidth: '420px' }}
          aria-label={`View ${featured.title}`}
        >
          <img src={featured.src} alt={featured.alt} width={840} height={840} />
          <div className="caption">{featured.title}</div>
        </button>
      </div>
      <div className="drawings-gallery-sheets">
        {sheets.map((item) => (
          <button
            key={item.src}
            type="button"
            className="glass-card drawings-gallery-item"
            onClick={() => setLightboxIndex(SAMPLE_WORK.indexOf(item))}
            aria-label={`View ${item.title}`}
          >
            <img src={item.src} alt={item.alt} width={800} height={600} />
            <div className="caption">{item.title}</div>
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <div className="drawings-lightbox" role="dialog" aria-modal="true" aria-label={SAMPLE_WORK[lightboxIndex].title}>
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
            style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#fff', border: 'none', borderRadius: 999, width: 40, height: 40, cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
          <img src={SAMPLE_WORK[lightboxIndex].src} alt={SAMPLE_WORK[lightboxIndex].alt} />
        </div>
      )}
    </div>
  );
};
