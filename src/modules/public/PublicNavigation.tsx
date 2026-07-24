import React, { useEffect, useState } from 'react';
import { Shield, LayoutDashboard, Bot, LogIn } from 'lucide-react';
import { NavigationMode } from '../../core/types';
import { security } from '../../core/security';

interface Props {
  activeView: string;
  setActiveView: (view: string) => void;
  setMode: (mode: NavigationMode) => void;
}

export const PublicNavigation: React.FC<Props> = ({ activeView, setActiveView, setMode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(security.getSession().isAuthenticated);

  useEffect(() => {
    // Sync session state changes
    const unsubscribe = security.subscribe(() => {
      setIsAuthenticated(security.getSession().isAuthenticated);
    });
    return unsubscribe;
  }, []);

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

          {isAuthenticated ? (
            <button className="btn btn-primary btn-sm" onClick={() => setMode('admin')}>
              <LayoutDashboard size={16} /> My Dashboard
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setMode('admin')}>
              <LogIn size={16} /> Login
            </button>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'stretch' }}>
            <button 
              className="btn btn-outline btn-sm" 
              style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', padding: '0.25rem 0.75rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
              onClick={() => { setActiveView('infrastructure'); setMode('public'); }}
            >
              Our Infrastructure Page
            </button>
            <button 
              className="btn btn-outline btn-sm" 
              style={{ borderColor: '#d97706', color: '#d97706', padding: '0.25rem 0.75rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
              onClick={() => { setActiveView('under-construction'); setMode('public'); }}
            >
              Under Construction
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
