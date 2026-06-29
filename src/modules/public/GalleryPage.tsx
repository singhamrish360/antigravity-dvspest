import React, { useState } from 'react';
import { ShieldCheck, Eye, Layers } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50);

  const galleryItems = [
    {
      title: 'Commercial Restaurant Kitchen Sanitation',
      category: 'Commercial Sanitation',
      before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      desc: 'Complete grease trap degreasing, biological foam application, and smart acoustic rodent exclusion.'
    },
    {
      title: 'Subterranean Termite Barrier Barrier Defense',
      category: 'Termite Protection',
      before: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      desc: 'Thermal imaging identified hidden colony gallery. Installed non-repellent chemical trench barrier.'
    }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div className="badge badge-success" style={{ marginBottom: '0.75rem' }}>Transformation Gallery</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Before & After Treatment Evidence</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Verified visual proof captured by field technicians during active compliance operations.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {galleryItems.map((item, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>{item.category}</span>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{item.title}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>

            {/* Interactive Image Split Slider */}
            <div style={{ position: 'relative', width: '100%', height: '420px', borderRadius: 'var(--radius-md)', overflow: 'hidden', userSelect: 'none' }}>
              {/* After Image (Background) */}
              <img src={item.after} alt="After Treatment" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }} className="badge badge-success">
                AFTER TREATMENT
              </div>

              {/* Before Image (Clipped Foreground) */}
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${sliderPos}%`, overflow: 'hidden', borderRight: '3px solid #fff', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
                <img src={item.before} alt="Before Treatment" style={{ absolute: 'absolute', top: 0, left: 0, width: '1000px', maxWidth: 'none', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }} className="badge badge-danger">
                  BEFORE INSPECTION
                </div>
              </div>

              {/* Range Input Slider Control */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={e => setSliderPos(Number(e.target.value))}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'ew-resize', zIndex: 20 }}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              ↔ Drag across the image to compare Before & After treatment state
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
