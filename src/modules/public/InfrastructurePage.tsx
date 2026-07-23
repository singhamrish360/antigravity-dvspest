import React from 'react';
import { SpaceTelemetryCanvas } from './SpaceTelemetryCanvas';
import { Shield, Zap, Server, Cpu, Database, Eye } from 'lucide-react';

export const InfrastructurePage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* Page Title */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>DVS Global Constellation</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>Pest Management & Telemetry Infrastructure</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>
          Explore our proprietary space-age dispatch mapping, 3D coordinate locks, and thermal sensor barriers deployed across Hazratganj, Gomti Nagar, and Uttar Pradesh.
        </p>
      </div>

      {/* Main 3D Telemetry Grid Visualizer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem', alignItems: 'center' }}>
        
        {/* Large 3D Telemetry Canvas Box */}
        <div className="glass-panel" style={{ padding: '2rem', background: '#090d16', border: '2px solid var(--accent-primary)', boxShadow: 'var(--shadow-glow)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fbbf24' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              📡 Active Orbital Scan Feed (Lucknow Sector)
            </span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>● ONLINE & SECURE</span>
          </div>
          
          <SpaceTelemetryCanvas />
          
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>
            [SYSTEM LOG]: Telemetry link established at 26.8467° N, 80.9462° E. Tracking active chemical trenches and heat patterns.
          </div>
        </div>

        {/* Tech Specifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Proprietary Tech Elements</h2>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
              <Cpu size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>AI Dispatch Optimization</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                Our algorithms automatically group and assign incoming inspection leads to Lucknow field operators based on real-time location telemetry.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0 }}>
              <Eye size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Thermal Scan Target Mapping</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                Deploying high-resolution thermal imaging to trace moisture pathways and pinpoint nesting areas hidden behind walls or inside wooden framing.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', flexShrink: 0 }}>
              <Shield size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Drill-Fill-Seal Chemical Barrier</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                Creating an invisible chemical trench barrier around building structures, preventing subterranean termites from entering the foundation.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Network Architecture Map details */}
      <div className="glass-panel" style={{ padding: '2.5rem', background: '#ffffff' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>DVS Physical Network Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>100%</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>SSL Transmission Security</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-secondary)', marginBottom: '0.25rem' }}>02 Hours</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Average Dispatch Time</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginBottom: '0.25rem' }}>04 Nodes</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Orbital Tracking Satellites</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#dc2626', marginBottom: '0.25rem' }}>24/7</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Emergency Alarm Hotline</div>
          </div>
        </div>
      </div>

    </div>
  );
};
