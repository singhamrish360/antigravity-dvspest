import React from 'react';

const ink = 'rgba(92, 68, 42, 0.42)';
const hat = 'rgba(201, 132, 42, 0.5)';
const hatBrim = 'rgba(92, 68, 42, 0.4)';
const wood = 'rgba(122, 90, 48, 0.4)';
const paper = 'rgba(250, 247, 241, 0.55)';

const stroke = {
  stroke: ink,
  strokeWidth: 1.6,
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const HardHat: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <path d={`M${x - 6} ${y} Q${x} ${y - 7} ${x + 6} ${y}`} fill={hat} stroke={hatBrim} strokeWidth="1.1" />
    <line x1={x - 8} y1={y} x2={x + 8} y2={y} stroke={hatBrim} strokeWidth="1.3" strokeLinecap="round" />
  </g>
);

const Head: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <>
    <circle cx={x} cy={y} r={5} {...stroke} />
    <HardHat x={x} y={y - 3} />
  </>
);

export const ConstructionCrewBackground: React.FC = () => (
  <div className="construction-crew" aria-hidden="true">
    {/* Walking, carrying bricks */}
    <svg className="crew-scene crew-walk-bricks" viewBox="0 0 80 80">
      <Head x={32} y={20} />
      <line x1="32" y1="25" x2="32" y2="46" {...stroke} />
      <line x1="32" y1="32" x2="18" y2="40" {...stroke} />
      <line x1="32" y1="32" x2="48" y2="36" {...stroke} />
      <rect x="44" y="30" width="10" height="7" rx="0.8" fill={wood} stroke={ink} strokeWidth="1" />
      <rect x="47" y="26" width="10" height="7" rx="0.8" fill={wood} stroke={ink} strokeWidth="1" />
      <line x1="32" y1="46" x2="24" y2="62" {...stroke} />
      <line x1="32" y1="46" x2="40" y2="62" {...stroke} />
    </svg>

    {/* Wheelbarrow */}
    <svg className="crew-scene crew-scene-wide crew-wheelbarrow" viewBox="0 0 140 90">
      <Head x={22} y={22} />
      <line x1="22" y1="27" x2="26" y2="50" {...stroke} />
      <line x1="22" y1="34" x2="14" y2="44" {...stroke} />
      <line x1="26" y1="36" x2="58" y2="40" {...stroke} />
      <line x1="26" y1="50" x2="18" y2="68" {...stroke} />
      <line x1="26" y1="50" x2="34" y2="68" {...stroke} />
      <path d="M54 42 L120 42 L110 26 L68 26 Z" fill={wood} stroke={ink} strokeWidth="1.4" />
      <line x1="58" y1="40" x2="86" y2="58" {...stroke} />
      <rect x="78" y="28" width="12" height="8" fill={wood} stroke={ink} strokeWidth="1" />
      <rect x="92" y="29" width="12" height="8" fill={wood} stroke={ink} strokeWidth="1" />
      <g className="crew-wheel">
        <circle cx="86" cy="60" r="9" {...stroke} />
        <line x1="86" y1="51" x2="86" y2="69" {...stroke} />
        <line x1="77" y1="60" x2="95" y2="60" {...stroke} />
      </g>
    </svg>

    {/* Hammering */}
    <svg className="crew-scene crew-hammer" viewBox="0 0 80 80">
      <line x1="44" y1="64" x2="70" y2="64" stroke={wood} strokeWidth="3" strokeLinecap="round" />
      <Head x={22} y={22} />
      <line x1="22" y1="27" x2="22" y2="48" {...stroke} />
      <line x1="22" y1="48" x2="16" y2="64" {...stroke} />
      <line x1="22" y1="48" x2="28" y2="64" {...stroke} />
      <line x1="22" y1="34" x2="14" y2="42" {...stroke} />
      <g className="crew-arm-hammer">
        <line x1="22" y1="30" x2="40" y2="24" {...stroke} />
        <line x1="40" y1="24" x2="46" y2="14" stroke={wood} strokeWidth="1.7" strokeLinecap="round" />
        <rect x="43" y="9" width="11" height="5" rx="1" fill={ink} />
      </g>
    </svg>

    {/* Measuring tape */}
    <svg className="crew-scene crew-measure" viewBox="0 0 90 80">
      <Head x={18} y={20} />
      <line x1="18" y1="25" x2="18" y2="46" {...stroke} />
      <line x1="18" y1="32" x2="10" y2="42" {...stroke} />
      <line x1="18" y1="46" x2="12" y2="62" {...stroke} />
      <line x1="18" y1="46" x2="26" y2="62" {...stroke} />
      <line x1="18" y1="32" x2="30" y2="36" {...stroke} />
      <rect x="28" y="33" width="8" height="6" rx="1" fill={hat} stroke={ink} strokeWidth="1" />
      <line className="crew-tape" x1="36" y1="36" x2="78" y2="36" stroke={ink} strokeWidth="1.4" />
    </svg>

    {/* Two workers carrying a beam */}
    <svg className="crew-scene crew-scene-wide crew-beam-pair" viewBox="0 0 140 90">
      <line x1="20" y1="34" x2="122" y2="34" stroke={wood} strokeWidth="3.2" strokeLinecap="round" />
      <Head x={28} y={20} />
      <line x1="28" y1="25" x2="28" y2="48" {...stroke} />
      <line x1="28" y1="32" x2="20" y2="30" {...stroke} />
      <line x1="28" y1="32" x2="36" y2="34" {...stroke} />
      <line x1="28" y1="48" x2="22" y2="66" {...stroke} />
      <line x1="28" y1="48" x2="36" y2="66" {...stroke} />
      <Head x={112} y={20} />
      <line x1="112" y1="25" x2="112" y2="48" {...stroke} />
      <line x1="112" y1="32" x2="104" y2="34" {...stroke} />
      <line x1="112" y1="32" x2="120" y2="30" {...stroke} />
      <line x1="112" y1="48" x2="106" y2="66" {...stroke} />
      <line x1="112" y1="48" x2="120" y2="66" {...stroke} />
    </svg>

    {/* Engineer reading a blueprint */}
    <svg className="crew-scene crew-engineer" viewBox="0 0 80 80">
      <Head x={30} y={18} />
      <line x1="30" y1="23" x2="30" y2="46" {...stroke} />
      <line x1="30" y1="46" x2="24" y2="62" {...stroke} />
      <line x1="30" y1="46" x2="38" y2="62" {...stroke} />
      <line x1="30" y1="32" x2="20" y2="40" {...stroke} />
      <line x1="30" y1="30" x2="44" y2="36" {...stroke} />
      <rect x="36" y="34" width="22" height="16" rx="1.2" fill={paper} stroke={ink} strokeWidth="1.2" />
      <line x1="40" y1="39" x2="54" y2="39" stroke={ink} strokeWidth="0.9" />
      <line x1="40" y1="43" x2="52" y2="43" stroke={ink} strokeWidth="0.9" />
      <line x1="40" y1="47" x2="50" y2="47" stroke={ink} strokeWidth="0.9" />
    </svg>

    {/* Scaffolding + climber */}
    <svg className="crew-scene crew-scene-tall crew-scaffold" viewBox="0 0 90 150">
      <line x1="18" y1="12" x2="18" y2="148" {...stroke} />
      <line x1="72" y1="12" x2="72" y2="148" {...stroke} />
      <line x1="18" y1="40" x2="72" y2="40" {...stroke} />
      <line x1="18" y1="76" x2="72" y2="76" {...stroke} />
      <line x1="18" y1="112" x2="72" y2="112" {...stroke} />
      <line x1="18" y1="16" x2="72" y2="40" stroke={ink} strokeWidth="1.1" />
      <line x1="18" y1="76" x2="72" y2="40" stroke={ink} strokeWidth="1.1" />
      <g className="crew-climber">
        <Head x={45} y={58} />
        <line x1="45" y1="63" x2="45" y2="84" {...stroke} />
        <line x1="45" y1="70" x2="32" y2="64" {...stroke} />
        <line x1="45" y1="70" x2="60" y2="64" {...stroke} />
        <line x1="45" y1="84" x2="38" y2="98" {...stroke} />
        <line x1="45" y1="84" x2="54" y2="98" {...stroke} />
      </g>
    </svg>

    {/* Crane lifting a beam */}
    <svg className="crew-scene crew-scene-crane crew-crane" viewBox="0 0 130 170">
      <line x1="24" y1="168" x2="24" y2="36" stroke={ink} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="16" y1="168" x2="32" y2="168" {...stroke} />
      <line x1="24" y1="40" x2="118" y2="28" stroke={ink} strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="40" x2="118" y2="28" stroke={ink} strokeWidth="1" opacity="0.5" />
      <line x1="24" y1="70" x2="24" y2="40" {...stroke} />
      <g className="crew-hook">
        <line x1="110" y1="30" x2="110" y2="62" {...stroke} />
        <path d="M104 62 H116 L116 70 Q110 78 104 70 Z" {...stroke} />
        <line x1="96" y1="80" x2="124" y2="80" stroke={wood} strokeWidth="2.6" strokeLinecap="round" />
      </g>
      {/* tiny operator in the cab */}
      <rect x="14" y="48" width="20" height="16" rx="1.5" {...stroke} />
      <circle cx="24" cy="55" r="3" {...stroke} />
    </svg>

    {/* Shoveling */}
    <svg className="crew-scene crew-shovel" viewBox="0 0 80 80">
      <Head x={28} y={20} />
      <line x1="28" y1="25" x2="28" y2="48" {...stroke} />
      <line x1="28" y1="48" x2="22" y2="64" {...stroke} />
      <line x1="28" y1="48" x2="36" y2="64" {...stroke} />
      <line x1="28" y1="34" x2="20" y2="42" {...stroke} />
      <line x1="28" y1="32" x2="48" y2="50" {...stroke} />
      <line x1="48" y1="50" x2="58" y2="58" stroke={wood} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M54 56 L66 62 L60 70 Z" fill={wood} stroke={ink} strokeWidth="1.1" />
    </svg>

    {/* Site supervisor with a flag / directing */}
    <svg className="crew-scene crew-direct" viewBox="0 0 80 80">
      <Head x={22} y={20} />
      <line x1="22" y1="25" x2="22" y2="48" {...stroke} />
      <line x1="22" y1="48" x2="16" y2="64" {...stroke} />
      <line x1="22" y1="48" x2="30" y2="64" {...stroke} />
      <line x1="22" y1="34" x2="14" y2="42" {...stroke} />
      <line x1="22" y1="32" x2="34" y2="18" {...stroke} />
      <g className="crew-flag">
        <line x1="34" y1="18" x2="34" y2="8" {...stroke} />
        <path d="M34 8 L52 14 L34 20 Z" fill={hat} stroke={ink} strokeWidth="1" />
      </g>
    </svg>
  </div>
);
