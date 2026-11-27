import React, { useMemo, useState } from 'react';
import { Calculator, MessageCircle } from 'lucide-react';
import {
  ELEVATION_FLAT_FEE,
  PHONE_DISPLAY,
  RATE_PER_SQFT,
  formatInr,
  formatSqFt,
  twoDCost,
  whatsappQuoteLink,
} from '../../seo/constants';

export interface CalculatorDefaults {
  lengthFt?: number;
  widthFt?: number;
  sqFt?: number;
  floors?: number;
  include3d?: boolean;
}

interface Props {
  defaults?: CalculatorDefaults;
  heading?: string;
}

const parsePositive = (value: string) => {
  const n = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export const DrawingsCalculator: React.FC<Props> = ({
  defaults,
  heading = 'Price calculator',
}) => {
  const initialMode: 'dimensions' | 'area' = defaults?.lengthFt && defaults?.widthFt ? 'dimensions' : 'area';
  const [mode, setMode] = useState<'dimensions' | 'area'>(initialMode);
  const [length, setLength] = useState(defaults?.lengthFt ? String(defaults.lengthFt) : '');
  const [width, setWidth] = useState(defaults?.widthFt ? String(defaults.widthFt) : '');
  const [area, setArea] = useState(defaults?.sqFt ? String(defaults.sqFt) : '');
  const [floors, setFloors] = useState(String(defaults?.floors ?? 1));
  const [include3d, setInclude3d] = useState(Boolean(defaults?.include3d));

  const lengthN = parsePositive(length);
  const widthN = parsePositive(width);
  const areaN = parsePositive(area);
  const floorsN = parsePositive(floors) || 0;

  const plotSqFt = useMemo(() => {
    if (mode === 'dimensions') return lengthN > 0 && widthN > 0 ? lengthN * widthN : 0;
    return areaN;
  }, [mode, lengthN, widthN, areaN]);

  const builtUp = plotSqFt > 0 && floorsN > 0 ? plotSqFt * floorsN : 0;
  const twoD = builtUp > 0 ? twoDCost(builtUp) : 0;
  const threeD = include3d ? ELEVATION_FLAT_FEE : 0;
  const total = twoD + threeD;

  const waHref = useMemo(() => {
    const parts = ['Hi DVS, I would like a quote for house drawings.'];
    if (mode === 'dimensions' && lengthN && widthN) {
      parts.push(` Plot size is ${formatSqFt(lengthN)} x ${formatSqFt(widthN)} ft (${formatSqFt(plotSqFt)} sq ft).`);
    } else if (plotSqFt) {
      parts.push(` Plot or floor area is ${formatSqFt(plotSqFt)} sq ft.`);
    } else {
      parts.push(' My plot size is ___ sq ft.');
    }
    if (floorsN) parts.push(` Floors: ${floorsN}.`);
    if (builtUp) parts.push(` Estimated built-up (plot or floor area × floors): ${formatSqFt(builtUp)} sq ft.`);
    if (twoD) parts.push(` 2D estimate at ₹${RATE_PER_SQFT}/sq ft: ${formatInr(twoD)}.`);
    if (include3d) parts.push(` Please include a 3D front elevation at ${formatInr(ELEVATION_FLAT_FEE)}.`);
    if (total) parts.push(` Combined estimate: ${formatInr(total)}.`);
    return whatsappQuoteLink(parts.join(''));
  }, [mode, lengthN, widthN, plotSqFt, floorsN, builtUp, twoD, include3d, total]);

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.7rem 0.85rem',
    borderRadius: 10,
    border: '1px solid var(--bg-glass-border)',
    font: 'inherit',
  };

  return (
    <div id="calculator" className="glass-panel" style={{ padding: '2rem 1.5rem', background: '#ffffff', scrollMarginTop: '6rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', justifyContent: 'center' }}>
        <Calculator size={20} style={{ color: 'var(--accent-primary)' }} />
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{heading}</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '640px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
        Enter plot dimensions or an area, and the number of floors. The 2D fee is {formatInr(RATE_PER_SQFT)} × estimated built-up area
        (area × floors). A 3D front elevation is an optional flat {formatInr(ELEVATION_FLAT_FEE)}. This is an estimate; setbacks often
        make the built-up area smaller, and we confirm the fee before drafting starts.
      </p>
      <div className="drawings-calc-grid">
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              type="button"
              className={mode === 'dimensions' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
              onClick={() => setMode('dimensions')}
            >
              Plot dimensions
            </button>
            <button
              type="button"
              className={mode === 'area' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
              onClick={() => setMode('area')}
            >
              Area in sq ft
            </button>
          </div>

          {mode === 'dimensions' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <label style={{ display: 'block' }}>
                <span className="form-label">Length (ft)</span>
                <input style={fieldStyle} inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} id="calc-length" />
              </label>
              <label style={{ display: 'block' }}>
                <span className="form-label">Width (ft)</span>
                <input style={fieldStyle} inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} id="calc-width" />
              </label>
            </div>
          ) : (
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              <span className="form-label">Plot or floor area (sq ft)</span>
              <input style={fieldStyle} inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} id="calc-area" />
            </label>
          )}

          <label style={{ display: 'block', marginBottom: '0.9rem' }}>
            <span className="form-label">Number of floors</span>
            <input style={fieldStyle} inputMode="numeric" value={floors} onChange={(e) => setFloors(e.target.value)} id="calc-floors" />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={include3d} onChange={(e) => setInclude3d(e.target.checked)} />
            Add 3D front elevation ({formatInr(ELEVATION_FLAT_FEE)} flat)
          </label>
        </div>

        <div className="glass-card" style={{ background: '#fff8f1' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Estimated built-up</div>
          <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{builtUp > 0 ? `${formatSqFt(builtUp)} sq ft` : '—'}</div>
          {plotSqFt > 0 && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              {mode === 'dimensions' && lengthN && widthN
                ? `${formatSqFt(lengthN)} × ${formatSqFt(widthN)} ft = ${formatSqFt(plotSqFt)} sq ft × ${floorsN || '—'} floor(s).`
                : `${formatSqFt(plotSqFt)} sq ft × ${floorsN || '—'} floor(s).`}
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span>2D AutoCAD</span>
            <strong>{twoD > 0 ? formatInr(twoD) : '—'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span>3D front elevation</span>
            <strong>{include3d ? formatInr(ELEVATION_FLAT_FEE) : 'Not added'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', marginBottom: '1rem' }}>
            <span>Total estimate</span>
            <strong style={{ color: 'var(--accent-primary)' }}>{builtUp > 0 ? formatInr(total) : '—'}</strong>
          </div>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
            <MessageCircle size={16} /> WhatsApp this quote
          </a>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0.75rem 0 0' }}>
            Opens WhatsApp to {PHONE_DISPLAY} with your figures filled in.
          </p>
        </div>
      </div>
    </div>
  );
};
