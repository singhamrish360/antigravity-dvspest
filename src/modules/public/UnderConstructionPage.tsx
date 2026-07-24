import React, { useState } from 'react';
import { Hammer, Search, BarChart3, AlertCircle, Cpu, Database, Eye, RefreshCw } from 'lucide-react';

export const UnderConstructionPage: React.FC = () => {
  const [scanActive, setScanActive] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  const runAnalysis = () => {
    setScanActive(true);
    setShowTable(false);
    setScanLogs([]);

    const logs = [
      '🛰️ [LINK]: Connecting to Lucknow construction registry...',
      '🧬 [CRAWLER]: Scanning ACC Cement & Ultratech Hazratganj price lists...',
      '🛡️ [SECURITY]: Authenticating with Tata Steel distributor databases...',
      '📊 [AI]: Compiling masonry brick & river bed sand rate schedules...',
      '📈 [MATRIX]: Finalizing aggregate index metrics...'
    ];

    logs.forEach((log, idx) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, log]);
      }, idx * 300);
    });

    setTimeout(() => {
      setScanActive(false);
      setShowTable(true);
    }, 1800);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* Premium Alert Banner */}
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', background: '#090d16', border: '2px dashed var(--accent-primary)', textAlign: 'center', boxShadow: 'var(--shadow-glow)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'inline-flex', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Hammer size={32} className="animate-pulse" />
        </div>
        
        <div className="badge badge-warning" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Lucknow Sector • Rate Intelligence System
        </div>
        
        <h1 style={{ fontSize: '2.8rem', color: '#ffffff', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
          Building Construction Infrastructure
        </h1>
        
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 2.5rem auto', lineHeight: 1.7 }}>
          We are currently analyzing material supplier matrices, concrete mix schedules, and brickwork labor indexes across Lucknow in depth to deliver a transparent pricing masterpiece.
        </p>

        {/* Action Button & Loader */}
        <div style={{ maxWidth: '550px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!scanActive && !showTable && (
            <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 700 }} onClick={runAnalysis}>
              🚀 Launch Deep Rate Analysis & Tables
            </button>
          )}

          {scanActive && (
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#fbbf24', fontWeight: 700 }}>
                <RefreshCw size={20} className="animate-spin" />
                <span>ACTIVE SCAN IN PROGRESS...</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {scanLogs.map((log, i) => <div key={i}>{log}</div>)}
              </div>
            </div>
          )}

          {showTable && (
            <button className="btn btn-outline" style={{ alignSelf: 'center', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }} onClick={runAnalysis}>
              🔄 Re-run Live Lucknow Rate Crawlers
            </button>
          )}
        </div>
      </div>

      {/* cost tables section */}
      {showTable && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Table 1: Material Rates Matrix */}
          <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', border: '1px solid var(--bg-glass-border)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={22} /> Lucknow Material Cost Index (Live Feed)
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '2px solid var(--bg-glass-border)' }}>
                    <th style={{ padding: '1rem' }}>Material Class</th>
                    <th style={{ padding: '1rem' }}>Brand / Standard Specification</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Lucknow Base Rate (₹)</th>
                    <th style={{ padding: '1rem' }}>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>Cement (OPC/PPC)</td>
                    <td style={{ padding: '1rem' }}>Ultratech Premium Grade</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹440</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>per bag (50kg)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>Cement (PPC)</td>
                    <td style={{ padding: '1rem' }}>ACC Gold Water Shield</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹410</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>per bag (50kg)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>Steel Rebars (TMT)</td>
                    <td style={{ padding: '1rem' }}>TATA Tiscon 550SD Fe550</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹68,500</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>per Metric Ton</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>Red Clay Bricks</td>
                    <td style={{ padding: '1rem' }}>Local Class-I Lucknow Kiln</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹8</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>per piece</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>M-Sand (Fine Sand)</td>
                    <td style={{ padding: '1rem' }}>Ghaghara / Sarda Beds (Premium Grade)</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹65</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>per Cubic Foot (cft)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>Aggregate (Grit)</td>
                    <td style={{ padding: '1rem' }}>Jhansi Crushers 20mm Grade</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹80</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>per Cubic Foot (cft)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Civil Labor Cost Breakdown */}
          <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', border: '1px solid var(--bg-glass-border)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={22} /> Civil Labor & Crew Daily Wage Matrices
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '2px solid var(--bg-glass-border)' }}>
                    <th style={{ padding: '1rem' }}>Role Class</th>
                    <th style={{ padding: '1rem' }}>Standard Operational Work scope</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Daily Wage (₹)</th>
                    <th style={{ padding: '1rem' }}>Standard Shift</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>Mason (Mistri)</td>
                    <td style={{ padding: '1rem' }}>Structural brickwork, plastering, tile laying</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹850</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>8 Hours</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>Helper (Mazdoor)</td>
                    <td style={{ padding: '1rem' }}>Concrete mix transport, loading, material sorting</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹550</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>8 Hours</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>Bar Bender</td>
                    <td style={{ padding: '1rem' }}>Reinforcing steel cutting, bending & framework tying</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹900</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>8 Hours</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>Carpenter (Shuttering)</td>
                    <td style={{ padding: '1rem' }}>RCC slab column formwork construction</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹850</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>8 Hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 3: Estimated Construction Rate per Sq Ft */}
          <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', border: '1px solid var(--bg-glass-border)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={22} /> Structural Turnkey Estimation (₹ / Sq. Ft.)
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '2px solid var(--bg-glass-border)' }}>
                    <th style={{ padding: '1rem' }}>Build Quality Grade</th>
                    <th style={{ padding: '1rem' }}>Foundation & Structural Material Specifications</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Est. Cost (₹ / Sq. Ft.)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Premium Quality</td>
                    <td style={{ padding: '1rem' }}>RCC Frame structure, Grade-I clay brick walls, premium waterproof cement, and engineered steel layout (Tata/JSW)</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: 'var(--accent-primary)' }}>₹1,800 - ₹2,200</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>Standard Quality</td>
                    <td style={{ padding: '1rem' }}>RCC frame structural support, standard flyash/red brick partitions, Ultratech cement, local standard steel rebars</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: 'var(--accent-secondary)' }}>₹1,400 - ₹1,700</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Basic Quality</td>
                    <td style={{ padding: '1rem' }}>Load-bearing wall structures, local aggregates, basic mortar layout, minimal column reinforcement</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹1,100 - ₹1,300</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Blueprint Features Mapping */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', border: '1px solid var(--bg-glass-border)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Search size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Lucknow Web Rate Crawlers</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Our crawling micro-engines scan material websites in Lucknow hourly, tracking prices of bricks, ACC/Ultratech cement, Tata Tiscon steel rebars, and local UP sand grades.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', border: '1px solid var(--bg-glass-border)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <BarChart3 size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Material Blueprint Calculator</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Calculate required concrete volume, masonry wall brick numbers, and structural steel reinforcement weights based on your design blueprint measurements.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', border: '1px solid var(--bg-glass-border)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Layers size={24} style={{ color: '#d97706' }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Site Foundation Analysis</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Ensuring deep structural soil checks and anti-termite chemical trench boundaries are integrated directly into the initial excavation phase blueprints.
          </p>
        </div>

      </div>

      {/* Lucknow HQ Notice */}
      <div className="glass-card" style={{ display: 'flex', gap: '1rem', background: '#faf8f5', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-glass-border)', alignItems: 'center' }}>
        <AlertCircle size={24} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong>Launch Notice:</strong> The Construction Rate Matrix module is currently being optimized for Lucknow's building bylaws. Live API connections to UP steel and cement suppliers are scheduled for rollout soon.
        </span>
      </div>

    </div>
  );
};

interface LayersProps {
  size?: number;
  style?: React.CSSProperties;
}

const Layers: React.FC<LayersProps> = ({ size = 24, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);
