import React, { useEffect, useState } from 'react';
import { Shield, LayoutDashboard, Bot, LogIn, Menu, X } from 'lucide-react';
import { NavigationMode } from '../../core/types';
import { security } from '../../core/security';

interface Props {
  activeView: string;
  setActiveView: (view: string) => void;
  setMode: (mode: NavigationMode) => void;
}

export const PublicNavigation: React.FC<Props> = ({ activeView, setActiveView, setMode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(security.getSession().isAuthenticated);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Sync session state changes
    const unsubscribe = security.subscribe(() => {
      setIsAuthenticated(security.getSession().isAuthenticated);
    });
    return unsubscribe;
  }, []);

  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
      
      {/* Media Queries Styling block */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 991px) {
          .desktop-nav { display: none !important; }
          .desktop-actions { display: none !important; }
          .mobile-toggle-btn { display: flex !important; }
        }
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle-btn { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
        @media (max-width: 576px) {
          .brand-text-title { font-size: 0.95rem !important; }
          .brand-text-sub { font-size: 0.6rem !important; }
          .brand-logo-container { width: 36px !important; height: 36px !important; }
        }
      `}} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', position: 'relative' }}>
        
        {/* Brand Logo & Firm Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => { setActiveView('home'); setIsMobileMenuOpen(false); }}>
          <div className="brand-logo-container" style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: 'var(--shadow-glow)', flexShrink: 0 }}>
            <Shield size={22} />
          </div>
          <div>
            <div className="brand-text-title" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DVS PEST CONTROL INFRASTRUCTURE CO
            </div>
            <div className="brand-text-sub" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-secondary)', marginTop: '-2px' }}>
              HEADQUARTERS: LUCKNOW, UTTAR PRADESH
            </div>
          </div>
        </div>

        {/* Public Nav Links (Desktop) */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
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

        {/* Action Controls (Desktop) */}
        <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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

        {/* Mobile Toggle Button */}
        <button 
          className="mobile-toggle-btn btn btn-outline btn-sm" 
          style={{ display: 'none', width: '40px', height: '40px', padding: 0, alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', borderColor: 'var(--bg-glass-border)' }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Drawer Dropdown */}
        {isMobileMenuOpen && (
          <div className="mobile-drawer" style={{ 
            background: 'rgba(255, 255, 255, 0.98)', 
            backdropFilter: 'blur(10px)', 
            borderBottom: '1px solid var(--bg-glass-border)', 
            padding: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.25rem',
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            boxShadow: 'var(--shadow-lg)',
            zIndex: 99
          }}>
            {/* Nav links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid var(--bg-glass-border)', paddingBottom: '1rem' }}>
              {[
                { id: 'home', label: 'Home' },
                { id: 'services', label: 'Services & Rates (₹)' },
                { id: 'consultation', label: 'Book Inspection' },
                { id: 'gallery', label: 'Before & After' },
                { id: 'blogs', label: 'Pest Science Blog' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveView(item.id); setIsMobileMenuOpen(false); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    color: activeView === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: activeView === item.id ? 700 : 500,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    padding: '0.25rem 0'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Actions Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-outline btn-sm" style={{ justifyContent: 'center' }} onClick={() => { setMode('ai'); setIsMobileMenuOpen(false); }}>
                <Bot size={16} /> AI Pest Scan
              </button>

              {isAuthenticated ? (
                <button className="btn btn-primary btn-sm" style={{ justifyContent: 'center' }} onClick={() => { setMode('admin'); setIsMobileMenuOpen(false); }}>
                  <LayoutDashboard size={16} /> My Dashboard
                </button>
              ) : (
                <button className="btn btn-primary btn-sm" style={{ justifyContent: 'center' }} onClick={() => { setMode('admin'); setIsMobileMenuOpen(false); }}>
                  <LogIn size={16} /> Login
                </button>
              )}

              <button 
                className="btn btn-outline btn-sm" 
                style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', justifyContent: 'center' }}
                onClick={() => { setActiveView('infrastructure'); setMode('public'); setIsMobileMenuOpen(false); }}
              >
                Our Infrastructure Page
              </button>
              <button 
                className="btn btn-outline btn-sm" 
                style={{ borderColor: '#d97706', color: '#d97706', justifyContent: 'center' }}
                onClick={() => { setActiveView('under-construction'); setMode('public'); setIsMobileMenuOpen(false); }}
              >
                Under Construction
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
