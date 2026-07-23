import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronDown, ArrowRight, Activity, MapPin, Award, Trash2 } from 'lucide-react';
import { store } from '../../core/store';
import { SpaceTelemetryCanvas } from './SpaceTelemetryCanvas';

interface Props {
  onBookClick: () => void;
  onServicesClick: () => void;
}

interface PestParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'cockroach' | 'rodent' | 'mosquito' | 'termite';
  size: number;
  angle: number;
  color: string;
  speed: number;
  isDead: boolean;
  splatTime: number; // to fade out splats
}

export const HomePage: React.FC<Props> = ({ onBookClick, onServicesClick }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [splatCount, setSplatCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<PestParticle[]>([]);

  const services = store.getServices();
  const approvedFeedback = store.getFeedback().filter(f => f.status === 'Approved');

  // Interactive Game Canvas: 1000 pests, Evasion & Splat on Click
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Click handler to squish bugs
    const handleCanvasClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      const clickRadius = 35; // Click hit box

      let squished = 0;
      particlesRef.current.forEach(p => {
        if (!p.isDead) {
          const dx = p.x - clickX;
          const dy = p.y - clickY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < clickRadius) {
            p.isDead = true;
            p.vx = 0;
            p.vy = 0;
            p.splatTime = Date.now();
            squished++;
          }
        }
      });

      if (squished > 0) {
        setSplatCount(prev => prev + squished);
        store.logAudit('PESTS_SQUISHED_GAME', 'Interactive Game', `User exterminated ${squished} bugs in background sandbox`);
      }
    };
    window.addEventListener('mousedown', handleCanvasClick);

    // Initializing 1000 pests
    const pestTypes: Array<'cockroach' | 'rodent' | 'mosquito' | 'termite'> = ['cockroach', 'rodent', 'mosquito', 'termite'];
    const colors = {
      cockroach: '#a0522d', // Reddish Brown
      rodent: '#696969',    // Slate Grey
      mosquito: '#1c1c1c',  // Charcoal Black
      termite: '#e6c280'    // Amber Wood Gold
    };

    const tempParticles: PestParticle[] = [];
    const particleCount = 1000;

    for (let i = 0; i < particleCount; i++) {
      const type = pestTypes[Math.floor(Math.random() * pestTypes.length)];
      tempParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        type,
        size: type === 'rodent' ? 8 + Math.random() * 4 : 4 + Math.random() * 3,
        angle: Math.random() * Math.PI * 2,
        color: colors[type],
        speed: type === 'mosquito' ? 2.5 : type === 'cockroach' ? 1.8 : 1.2,
        isDead: false,
        splatTime: 0
      });
    }
    particlesRef.current = tempParticles;

    const drawBug = (ctx: CanvasRenderingContext2D, p: PestParticle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      if (p.isDead) {
        // Render squished bug / splat puddle
        const timePassed = Date.now() - p.splatTime;
        const opacity = Math.max(0, 1 - timePassed / 15000); // Fades out over 15 seconds

        ctx.fillStyle = p.type === 'cockroach' ? `rgba(139, 69, 19, ${opacity * 0.7})` : `rgba(105, 105, 105, ${opacity * 0.7})`;
        ctx.beginPath();
        // Irregular splat puddle
        ctx.arc(0, 0, p.size * 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Small splat droplets
        for (let j = 0; j < 5; j++) {
          const dropAngle = (j * Math.PI * 2) / 5;
          const dist = p.size * 1.3;
          ctx.beginPath();
          ctx.arc(Math.cos(dropAngle) * dist, Math.sin(dropAngle) * dist, p.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        return;
      }

      ctx.fillStyle = p.color;

      if (p.type === 'cockroach') {
        // Cockroach: Oval body, legs, antenna
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath();
          ctx.moveTo(i * 3, 0);
          ctx.lineTo(i * 3 + (i * 2), -p.size);
          ctx.moveTo(i * 3, 0);
          ctx.lineTo(i * 3 + (i * 2), p.size);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(p.size, -1);
        ctx.lineTo(p.size * 1.8, -p.size * 0.7);
        ctx.moveTo(p.size, 1);
        ctx.lineTo(p.size * 1.8, p.size * 0.7);
        ctx.stroke();

      } else if (p.type === 'rodent') {
        // Rodent: Body, tail, ears
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = '#e9a1a1';
        ctx.lineWidth = 1.2;
        ctx.moveTo(-p.size, 0);
        ctx.quadraticCurveTo(-p.size * 1.5, Math.sin(Date.now() * 0.01) * 3, -p.size * 2, 0);
        ctx.stroke();
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.size * 0.3, -p.size * 0.4, 2, 0, Math.PI * 2);
        ctx.arc(p.size * 0.3, p.size * 0.4, 2, 0, Math.PI * 2);
        ctx.fill();

      } else if (p.type === 'mosquito') {
        // Mosquito: body, proboscis, wings
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = p.color;
        ctx.moveTo(0, 0);
        ctx.lineTo(p.size * 1.5, 0);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.ellipse(0, -p.size * 0.4, p.size * 0.8, p.size * 0.3, -Math.PI / 4, 0, Math.PI * 2);
        ctx.ellipse(0, p.size * 0.4, p.size * 0.8, p.size * 0.3, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

      } else if (p.type === 'termite') {
        // Termite: segmented
        ctx.beginPath();
        ctx.arc(-p.size * 0.4, 0, p.size * 0.4, 0, Math.PI * 2);
        ctx.arc(0, 0, p.size * 0.3, 0, Math.PI * 2);
        ctx.arc(p.size * 0.4, 0, p.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const update = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const evasionRadius = 160;
      const evasionForce = 5.5;

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];

        if (p.isDead) {
          drawBug(ctx, p);
          continue;
        }

        // Evasion logic from cursor
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < evasionRadius) {
          const force = (evasionRadius - dist) / evasionRadius;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * evasionForce;
          p.vy += Math.sin(angle) * force * evasionForce;
          p.angle = angle;
        } else {
          p.vx += (Math.random() - 0.5) * 0.3;
          p.vy += (Math.random() - 0.5) * 0.3;

          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > p.speed) {
            p.vx *= 0.91;
            p.vy *= 0.91;
          }
          if (speed > 0.1) {
            p.angle = Math.atan2(p.vy, p.vx);
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        drawBug(ctx, p);
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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
      
      {/* High-Performance Game Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          cursor: 'crosshair',
          opacity: 0.5
        }}
      />

      {/* Floating Extermination Score Badge */}
      {splatCount > 0 && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '2rem',
          zIndex: 100,
          background: 'var(--gradient-brand)',
          color: '#fff',
          padding: '0.65rem 1.25rem',
          borderRadius: 'var(--radius-full)',
          fontWeight: 800,
          fontSize: '0.95rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease'
        }}>
          <Award size={18} /> Pests Exterminated: {splatCount}
        </div>
      )}

      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '5rem 1.5rem', overflow: 'hidden', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-surface)', border: '1px solid var(--bg-glass-border)', boxShadow: 'var(--shadow-md)', zIndex: 3 }}>
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
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: '#090d16', boxShadow: 'var(--shadow-lg)', border: '1px solid #1e293b' }}>
              <SpaceTelemetryCanvas />
              <div style={{ position: 'absolute', bottom: '2.2rem', left: '2.2rem', right: '2.2rem' }} className="glass-panel">
                <div style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(9, 13, 22, 0.95)', border: '1px solid var(--accent-primary)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Activity size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>Lucknow Dispatch Telemetry</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Active orbital scanning & dispatch lines in Hazratganj & Gomti Nagar</div>
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
              
              {srv.id === 'SRV-101' || srv.id === 'SRV-102' || srv.id === 'SRV-103' || srv.id === 'SRV-104' || srv.id === 'SRV-105' ? (
                <div style={{ 
                  width: '100%', 
                  height: '180px', 
                  borderRadius: 'var(--radius-sm)', 
                  marginBottom: '1.25rem',
                  backgroundImage: 'url(/services-grid.jpg)',
                  backgroundSize: '205% 205%',
                  backgroundPosition: 
                    srv.id === 'SRV-101' ? '0% 0%' : // Top Left (Cockroaches)
                    srv.id === 'SRV-102' ? '100% 0%' : // Top Right (Rodents)
                    srv.id === 'SRV-103' ? '0% 100%' : // Bottom Left (Mosquitoes)
                    srv.id === 'SRV-104' ? '100% 100%' : // Bottom Right (Termites)
                    '0% 100%', // Bottom Left for fumigation
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
                  border: '1px solid var(--bg-glass-border)'
                }} />
              ) : (
                <img src={srv.imageUrl} alt={srv.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }} />
              )}
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
