import React, { useEffect, useRef, useState } from 'react';
import { PencilRuler } from 'lucide-react';

type PieceKind = 'wall' | 'partition' | 'door' | 'window' | 'dimension' | 'house' | 'north';

interface Piece {
  id: string;
  kind: PieceKind;
  // Local plan coordinates (origin top-left of the 420x300 plan)
  tx: number;
  ty: number;
  tw: number;
  th: number;
  trot: number;
  x: number;
  y: number;
  rot: number;
  placed: boolean;
  snapping: boolean;
  snap: number; // 0-1
  fromX: number;
  fromY: number;
  fromRot: number;
  drift: number;
  label?: string;
}

interface PlanFrame {
  left: number;
  top: number;
  scale: number;
}

const PLAN_W = 420;
const PLAN_H = 300;

const desktopPieces = (): Omit<Piece, 'x' | 'y' | 'rot' | 'placed' | 'snapping' | 'snap' | 'fromX' | 'fromY' | 'fromRot' | 'drift'>[] => [
  { id: 'top', kind: 'wall', tx: 40, ty: 40, tw: 340, th: 0, trot: 0 },
  { id: 'bottom', kind: 'wall', tx: 40, ty: 250, tw: 340, th: 0, trot: 0 },
  { id: 'left', kind: 'wall', tx: 40, ty: 40, tw: 210, th: 0, trot: Math.PI / 2 },
  { id: 'right', kind: 'wall', tx: 380, ty: 40, tw: 210, th: 0, trot: Math.PI / 2 },
  { id: 'partition', kind: 'partition', tx: 40, ty: 145, tw: 200, th: 0, trot: 0 },
  { id: 'door', kind: 'door', tx: 150, ty: 250, tw: 40, th: 40, trot: 0 },
  { id: 'win1', kind: 'window', tx: 110, ty: 40, tw: 50, th: 0, trot: 0 },
  { id: 'win2', kind: 'window', tx: 260, ty: 40, tw: 50, th: 0, trot: 0 },
  { id: 'dim', kind: 'dimension', tx: 40, ty: 272, tw: 340, th: 0, trot: 0, label: "32'-0\"" },
  { id: 'house', kind: 'house', tx: 290, ty: 70, tw: 70, th: 60, trot: 0 },
  { id: 'north', kind: 'north', tx: 400, ty: 18, tw: 16, th: 28, trot: 0 },
];

const mobilePieces = (): ReturnType<typeof desktopPieces> => [
  { id: 'top', kind: 'wall', tx: 50, ty: 50, tw: 320, th: 0, trot: 0 },
  { id: 'bottom', kind: 'wall', tx: 50, ty: 240, tw: 320, th: 0, trot: 0 },
  { id: 'left', kind: 'wall', tx: 50, ty: 50, tw: 190, th: 0, trot: Math.PI / 2 },
  { id: 'right', kind: 'wall', tx: 370, ty: 50, tw: 190, th: 0, trot: Math.PI / 2 },
  { id: 'door', kind: 'door', tx: 160, ty: 240, tw: 40, th: 40, trot: 0 },
  { id: 'win1', kind: 'window', tx: 140, ty: 50, tw: 50, th: 0, trot: 0 },
  { id: 'dim', kind: 'dimension', tx: 50, ty: 262, tw: 320, th: 0, trot: 0, label: "32'-0\"" },
  { id: 'house', kind: 'house', tx: 280, ty: 90, tw: 70, th: 60, trot: 0 },
];

const ink = 'rgba(90, 68, 40, 0.72)';
const inkStrong = 'rgba(70, 50, 28, 0.88)';
const inkSoft = 'rgba(180, 140, 80, 0.28)';

const layoutPlan = (width: number, height: number): PlanFrame => {
  // Keep the assembled plan large enough to peek around the content column.
  const maxScale = width < 700 ? 0.85 : 1.35;
  const scale = Math.min(maxScale, (width * 0.72) / PLAN_W, (height * 0.62) / PLAN_H);
  const left = (width - PLAN_W * scale) / 2;
  const top = height * (width < 700 ? 0.22 : 0.18);
  return { left, top, scale };
};

const toScreen = (frame: PlanFrame, x: number, y: number) => ({
  x: frame.left + x * frame.scale,
  y: frame.top + y * frame.scale,
});

const seedPieces = (width: number, height: number, frame: PlanFrame, mobile: boolean): Piece[] => {
  const defs = mobile ? mobilePieces() : desktopPieces();
  return defs.map((def, i) => {
    const target = toScreen(frame, def.tx, def.ty);
    // Scatter around the viewport, away from the exact target
    const angle = (i / defs.length) * Math.PI * 2 + Math.random() * 0.5;
    const radius = Math.min(width, height) * (0.22 + Math.random() * 0.22);
    const x = Math.max(24, Math.min(width - 24, width / 2 + Math.cos(angle) * radius));
    const y = Math.max(80, Math.min(height - 80, height / 2 + Math.sin(angle) * radius * 0.85));
    return {
      ...def,
      x,
      y,
      rot: def.trot + (Math.random() - 0.5) * 0.7,
      placed: false,
      snapping: false,
      snap: 0,
      fromX: x,
      fromY: y,
      fromRot: 0,
      drift: Math.random() * Math.PI * 2,
    };
  });
};

const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.save();
  ctx.strokeStyle = inkSoft;
  ctx.lineWidth = 1;
  const step = 24;
  for (let x = 0; x <= width; x += step) {
    ctx.globalAlpha = x % 120 === 0 ? 0.7 : 0.35;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += step) {
    ctx.globalAlpha = y % 120 === 0 ? 0.7 : 0.35;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
};

const drawPiece = (ctx: CanvasRenderingContext2D, p: Piece, frame: PlanFrame, placedGlow: boolean) => {
  const scale = frame.scale;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.strokeStyle = p.placed ? inkStrong : ink;
  ctx.fillStyle = p.placed ? inkStrong : ink;
  ctx.lineWidth = p.placed ? 2 : 1.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (placedGlow && p.placed) {
    ctx.shadowColor = 'rgba(217, 119, 6, 0.35)';
    ctx.shadowBlur = 10;
  }

  const w = p.tw * scale;
  const h = Math.max(p.th * scale, 8);

  if (p.kind === 'wall' || p.kind === 'partition') {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.stroke();
    if (p.kind === 'wall') {
      ctx.lineWidth = Math.max(3, 3 * scale * 0.6);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.stroke();
    }
  } else if (p.kind === 'door') {
    const r = 36 * scale;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -8 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r, -Math.PI / 2, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r, 0);
    ctx.stroke();
  } else if (p.kind === 'window') {
    ctx.beginPath();
    ctx.moveTo(0, -4 * scale);
    ctx.lineTo(0, 4 * scale);
    ctx.moveTo(w, -4 * scale);
    ctx.lineTo(w, 4 * scale);
    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -2 * scale);
    ctx.lineTo(w, -2 * scale);
    ctx.moveTo(0, 2 * scale);
    ctx.lineTo(w, 2 * scale);
    ctx.stroke();
  } else if (p.kind === 'dimension') {
    const tick = 8 * scale;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.moveTo(0, -tick);
    ctx.lineTo(0, tick);
    ctx.moveTo(w, -tick);
    ctx.lineTo(w, tick);
    // arrow heads
    ctx.moveTo(0, 0);
    ctx.lineTo(6 * scale, -4 * scale);
    ctx.moveTo(0, 0);
    ctx.lineTo(6 * scale, 4 * scale);
    ctx.moveTo(w, 0);
    ctx.lineTo(w - 6 * scale, -4 * scale);
    ctx.moveTo(w, 0);
    ctx.lineTo(w - 6 * scale, 4 * scale);
    ctx.stroke();
    if (p.label) {
      ctx.font = `${Math.max(10, 11 * scale)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(p.label, w / 2, -4 * scale);
    }
  } else if (p.kind === 'house') {
    const hw = 70 * scale;
    const hh = 44 * scale;
    ctx.beginPath();
    ctx.rect(0, hh * 0.35, hw, hh * 0.65);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-4 * scale, hh * 0.35);
    ctx.lineTo(hw / 2, 0);
    ctx.lineTo(hw + 4 * scale, hh * 0.35);
    ctx.closePath();
    ctx.stroke();
    // door
    ctx.beginPath();
    ctx.rect(hw * 0.42, hh * 0.58, hw * 0.16, hh * 0.42);
    ctx.stroke();
    // window
    ctx.strokeRect(hw * 0.14, hh * 0.52, hw * 0.16, hh * 0.16);
    ctx.strokeRect(hw * 0.70, hh * 0.52, hw * 0.16, hh * 0.16);
  } else if (p.kind === 'north') {
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 0);
    ctx.lineTo(-5 * scale, 10 * scale);
    ctx.moveTo(0, 0);
    ctx.lineTo(5 * scale, 10 * scale);
    ctx.stroke();
    ctx.font = `bold ${Math.max(9, 10 * scale)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('N', 0, -4 * scale);
  }

  ctx.restore();
  void h;
};

export const BlueprintBackgroundGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const piecesRef = useRef<Piece[]>([]);
  const frameRef = useRef<PlanFrame>({ left: 0, top: 0, scale: 1 });
  const [drawn, setDrawn] = useState(0);
  const [total, setTotal] = useState(0);
  const completeRef = useRef(false);
  const drawnRef = useRef(0);
  const [complete, setComplete] = useState(false);

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
    let completeGlow = 0;

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

    const rebuild = () => {
      const mobile = width < 700;
      const frame = layoutPlan(width, height);
      frameRef.current = frame;
      piecesRef.current = seedPieces(width, height, frame, mobile);
      completeRef.current = false;
      drawnRef.current = 0;
      completeGlow = 0;
      setComplete(false);
      setDrawn(0);
      setTotal(piecesRef.current.length);
    };

    applySize();
    rebuild();

    const handleResize = () => {
      applySize();
      const frame = layoutPlan(width, height);
      frameRef.current = frame;
      piecesRef.current.forEach((p) => {
        if (p.placed || p.snapping) {
          const t = toScreen(frame, p.tx, p.ty);
          p.x = t.x;
          p.y = t.y;
          p.rot = p.trot;
        }
      });
    };

    const handlePointer = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const hitR = width < 700 ? 44 : 36;
      let best: Piece | null = null;
      let bestDist = hitR;
      piecesRef.current.forEach((p) => {
        if (p.placed || p.snapping) return;
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < bestDist) {
          bestDist = dist;
          best = p;
        }
      });
      if (!best) return;
      const piece = best;
      const target = toScreen(frameRef.current, piece.tx, piece.ty);
      piece.fromX = piece.x;
      piece.fromY = piece.y;
      piece.fromRot = piece.rot;
      piece.snapping = true;
      piece.snap = reducedMotion ? 1 : 0;
      // Keep target coords in closure via piece
      piece.tx = piece.tx;
      void target;
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
      drawGrid(ctx, width, height);

      const frame = frameRef.current;
      const now = Date.now();
      let placedCount = 0;

      piecesRef.current.forEach((p) => {
        const target = toScreen(frame, p.tx, p.ty);
        if (p.snapping) {
          p.snap = reducedMotion ? 1 : Math.min(1, p.snap + 0.08);
          const t = 1 - Math.pow(1 - p.snap, 3);
          p.x = p.fromX + (target.x - p.fromX) * t;
          p.y = p.fromY + (target.y - p.fromY) * t;
          p.rot = p.fromRot + (p.trot - p.fromRot) * t;
          if (p.snap >= 1) {
            p.snapping = false;
            p.placed = true;
            p.x = target.x;
            p.y = target.y;
            p.rot = p.trot;
          }
        } else if (p.placed) {
          p.x = target.x;
          p.y = target.y;
          p.rot = p.trot;
        } else if (!reducedMotion) {
          p.drift += 0.012;
          p.x += Math.sin(p.drift + now * 0.0003) * 0.15;
          p.y += Math.cos(p.drift * 0.9) * 0.12;
        }

        if (p.placed) placedCount++;
        drawPiece(ctx, p, frame, completeRef.current);
      });

      if (placedCount !== drawnRef.current) {
        drawnRef.current = placedCount;
        setDrawn(placedCount);
      }
      if (placedCount === piecesRef.current.length && piecesRef.current.length > 0 && !completeRef.current) {
        completeRef.current = true;
        setComplete(true);
      }
      if (completeRef.current && completeGlow < 1) {
        completeGlow = Math.min(1, completeGlow + 0.02);
      }

      frameId = requestAnimationFrame(update);
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('pointerdown', handlePointer);
    document.addEventListener('visibilitychange', onVisibility);
    motionQuery.addEventListener('change', onMotionChange);
    frameId = requestAnimationFrame(update);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="bg-game-canvas bg-game-canvas-drawings" aria-hidden="true" />
      {drawn > 0 && (
        <div className="bg-game-score" aria-live="polite">
          <PencilRuler size={16} />
          {complete ? 'Plan complete' : `Plan drawn ${drawn}/${total || '—'}`}
        </div>
      )}
    </>
  );
};
