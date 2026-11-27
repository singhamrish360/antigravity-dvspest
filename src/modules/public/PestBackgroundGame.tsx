import React, { useEffect, useRef, useState } from 'react';
import { Award } from 'lucide-react';

type PestType = 'cockroach' | 'rodent' | 'mosquito' | 'termite';

interface PestParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: PestType;
  size: number;
  angle: number;
  color: string;
  speed: number;
  isDead: boolean;
  splatTime: number;
}

const COLORS: Record<PestType, string> = {
  cockroach: '#a0522d',
  rodent: '#696969',
  mosquito: '#1c1c1c',
  termite: '#e6c280',
};

const TYPES: PestType[] = ['cockroach', 'rodent', 'mosquito', 'termite'];

const pestCountFor = (width: number, reduced: boolean) => {
  if (reduced) return width < 700 ? 36 : 80;
  if (width < 700) return 70;
  if (width < 1024) return 160;
  return 320;
};

const drawBug = (ctx: CanvasRenderingContext2D, p: PestParticle) => {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);

  if (p.isDead) {
    const opacity = Math.max(0, 1 - (Date.now() - p.splatTime) / 15000);
    ctx.fillStyle = p.type === 'cockroach' ? `rgba(139, 69, 19, ${opacity * 0.7})` : `rgba(105, 105, 105, ${opacity * 0.7})`;
    ctx.beginPath();
    ctx.arc(0, 0, p.size * 1.2, 0, Math.PI * 2);
    ctx.fill();
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
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 3, 0);
      ctx.lineTo(i * 3 + i * 2, -p.size);
      ctx.moveTo(i * 3, 0);
      ctx.lineTo(i * 3 + i * 2, p.size);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(p.size, -1);
    ctx.lineTo(p.size * 1.8, -p.size * 0.7);
    ctx.moveTo(p.size, 1);
    ctx.lineTo(p.size * 1.8, p.size * 0.7);
    ctx.stroke();
  } else if (p.type === 'rodent') {
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
  } else {
    ctx.beginPath();
    ctx.arc(-p.size * 0.4, 0, p.size * 0.4, 0, Math.PI * 2);
    ctx.arc(0, 0, p.size * 0.3, 0, Math.PI * 2);
    ctx.arc(p.size * 0.4, 0, p.size * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};

const spawnPests = (width: number, height: number, count: number): PestParticle[] => {
  const pests: PestParticle[] = [];
  for (let i = 0; i < count; i++) {
    const type = TYPES[Math.floor(Math.random() * TYPES.length)];
    pests.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      type,
      size: type === 'rodent' ? 8 + Math.random() * 4 : 4 + Math.random() * 3,
      angle: Math.random() * Math.PI * 2,
      color: COLORS[type],
      speed: type === 'mosquito' ? 2.5 : type === 'cockroach' ? 1.8 : 1.2,
      isDead: false,
      splatTime: 0,
    });
  }
  return pests;
};

export const PestBackgroundGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<PestParticle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [splatCount, setSplatCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frameId = 0;
    let running = true;

    const applySize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resetPests = () => {
      particlesRef.current = spawnPests(width, height, pestCountFor(width, reducedMotion));
    };

    applySize();
    resetPests();

    const handleResize = () => {
      const prevW = width;
      const prevH = height;
      applySize();
      particlesRef.current.forEach((p) => {
        p.x = (p.x / prevW) * width;
        p.y = (p.y / prevH) * height;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handlePointer = (e: PointerEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      const clickRadius = 35;
      let squished = 0;
      particlesRef.current.forEach((p) => {
        if (p.isDead) return;
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        if (Math.sqrt(dx * dx + dy * dy) < clickRadius) {
          p.isDead = true;
          p.vx = 0;
          p.vy = 0;
          p.splatTime = Date.now();
          squished++;
        }
      });
      if (squished > 0) setSplatCount((prev) => prev + squished);
    };

    const onMotionChange = () => {
      reducedMotion = motionQuery.matches;
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frameId);
      } else if (!running) {
        running = true;
        frameId = requestAnimationFrame(update);
      }
    };

    const update = () => {
      if (!running) return;
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

        if (!reducedMotion) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < evasionRadius && mouse.x > -100) {
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
            if (speed > 0.1) p.angle = Math.atan2(p.vy, p.vx);
          }

          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }

        drawBug(ctx, p);
      }

      frameId = requestAnimationFrame(update);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('pointerdown', handlePointer);
    document.addEventListener('visibilitychange', onVisibility);
    motionQuery.addEventListener('change', onMotionChange);
    frameId = requestAnimationFrame(update);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="bg-game-canvas"
        aria-hidden="true"
      />
      {splatCount > 0 && (
        <div className="bg-game-score" aria-live="polite">
          <Award size={16} /> Pests caught: {splatCount}
        </div>
      )}
    </>
  );
};
