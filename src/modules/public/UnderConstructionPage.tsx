import React from 'react';
import { Hammer, Search, BarChart3, AlertCircle, ShieldAlert, Layers } from 'lucide-react';

export const UnderConstructionPage: React.FC = () => {
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

        {/* Dynamic Construction Progress Tracker */}
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'monospace' }}>
            <span>LUCKNOW RATE INTEGRATION PIPELINE</span>
            <span>45% COMPLETE</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg, #fbbf24, #d97706)', borderRadius: '4px' }} />
          </div>
        </div>
      </div>

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
            <Layers size={24} />
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
