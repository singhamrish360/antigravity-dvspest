import React, { useState } from 'react';

export const GalleryPage: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50);

  const galleryItems = [
    {
      title: 'Commercial Restaurant Kitchen Sanitation',
      category: 'Commercial Sanitation',
      before: '/before-after-infestation.png',
      after: '/before-after-infestation.png',
      isSplitSprite: true,
      desc: 'Complete grease trap degreasing, biological foam application, and deep tiles sanitization in Hazratganj restaurant.'
    },
    {
      title: 'Subterranean Termite Barrier Defense',
      category: 'Termite Protection',
      before: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80', // Damaged dusty construction wood
      after: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', // Clean foundation structure completed
      isSplitSprite: false,
      desc: 'Thermal imaging identified hidden colony gallery. Installed non-repellent chemical drill barrier.'
    }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div className="badge badge-success" style={{ marginBottom: '0.75rem' }}>Transformation Gallery</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Before & After Treatment Evidence</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Verified visual proof captured by field technicians during active compliance operations in Lucknow.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {galleryItems.map((item, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '2rem', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>{item.category}</span>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{item.title}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>

            {/* Interactive Image Split Slider utilizing CSS clipPath */}
            <div style={{ position: 'relative', width: '100%', height: '450px', borderRadius: 'var(--radius-md)', overflow: 'hidden', userSelect: 'none' }}>
              
              {item.isSplitSprite ? (
                <>
                  {/* After Image (Background - Right half of grid) */}
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    backgroundImage: `url(${item.after})`,
                    backgroundSize: '200% 100%',
                    backgroundPosition: 'right center',
                    backgroundRepeat: 'no-repeat'
                  }} />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }} className="badge badge-success">
                    AFTER TREATMENT
                  </div>

                  {/* Before Image (Clipped overlay - Left half of grid) */}
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    backgroundImage: `url(${item.before})`,
                    backgroundSize: '200% 100%',
                    backgroundPosition: 'left center',
                    backgroundRepeat: 'no-repeat',
                    clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                    transition: 'none'
                  }} />
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }} className="badge badge-danger">
                    BEFORE INSPECTION
                  </div>
                </>
              ) : (
                <>
                  {/* After Image (Background) */}
                  <img 
                    src={item.after} 
                    alt="After Treatment" 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }} className="badge badge-success">
                    AFTER TREATMENT
                  </div>

                  {/* Before Image (Clipped overlay using clip-path) */}
                  <img 
                    src={item.before} 
                    alt="Before Treatment" 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                      transition: 'none'
                    }} 
                  />
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }} className="badge badge-danger">
                    BEFORE INSPECTION
                  </div>
                </>
              )}

              {/* Visual Divider line handle */}
              <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${sliderPos}%`,
                width: '4px',
                background: '#ffffff',
                boxShadow: '0 0 12px rgba(0,0,0,0.5)',
                zIndex: 15,
                transform: 'translateX(-50%)',
                pointerEvents: 'none'
              }}>
                {/* Golden circular dragging handle */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--gradient-brand)',
                  border: '3px solid #ffffff',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '12px'
                }}>
                  ↔
                </div>
              </div>

              {/* Range Input Slider Control */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={e => setSliderPos(Number(e.target.value))}
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  opacity: 0, 
                  cursor: 'ew-resize', 
                  zIndex: 20 
                }}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              ↔ Slide the handle left and right to inspect the before and after status
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
