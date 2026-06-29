import React from 'react';
import { Shield, LayoutDashboard, UserCheck, Bot } from 'lucide-react';
import { NavigationMode } from '../../core/types';

interface Props {
  activeView: string;
  setActiveView: (view: string) => void;
  setMode: (mode: NavigationMode) => void;
}

export const PublicNavigation: React.FC<Props> = ({ activeView, setActiveView, setMode }) => {
  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        
        {/* Brand Logo & Firm Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveView('home')}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: 'var(--shadow-glow)' }}>
            <Shield size={26} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DVS PEST CONTROL INFRASTRUCTURE CO
            </div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-secondary)', marginTop: '-2px' }}>
              HEADQUARTERS: LUCKNOW, UTTAR PRADESH
            </div>
          </div>
        </div>

        {/* Public Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'services', label: 'Services & Rates (₹)' },
            { id: 'consultation', label: 'Book Inspection' },
            { id: 'gallery', label: 'Before & After' },
            { id: 'blogs', label: 'Pest Science Blog' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeView === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: activeView === item.id ? 700 : 500,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'color var(--transition-fast)',
                padding: '0.25rem 0'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setMode('ai')}>
            <Bot size={16} /> AI Pest Scan
          </button>

          <button className="btn btn-secondary btn-sm" onClick={() => setMode('crm')}>
            <UserCheck size={16} /> CRM Portal
          </button>

          <button className="btn btn-primary btn-sm" onClick={() => setMode('admin')}>
            <LayoutDashboard size={16} /> Admin SaaS
          </button>
        </div>

      </div>
    </header>
  );
};
