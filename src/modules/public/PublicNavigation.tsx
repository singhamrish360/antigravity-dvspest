import React, { useState } from 'react';
import { Shield, Menu, X, MessageCircle, Phone } from 'lucide-react';
import { NavigationMode } from '../../core/types';
import { handleInternalNav } from '../../seo/navigate';

interface Props {
  activeView: string;
  setActiveView: (view: string) => void;
  setMode: (mode: NavigationMode) => void;
}

const PHONE_TEL = 'tel:+919330478897';

const NAV_LINKS = [
  { id: 'services', label: 'Pest Control' },
  { id: 'drawings', label: 'House Drawings' },
  { id: 'virtual-twin', label: 'Chat' },
  { id: 'consultation', label: 'Contact' },
];

export const PublicNavigation: React.FC<Props> = ({ activeView, setActiveView, setMode: _setMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const go = (view: string) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  const isActive = (id: string) =>
    activeView === id || (id === 'services' && activeView === 'home');

  return (
    <header className="site-header">
      <style dangerouslySetInnerHTML={{ __html: `
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--bg-glass-border);
        }
        .site-header-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0.75rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .site-brand {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          cursor: pointer;
          min-width: 0;
          background: none;
          border: none;
          padding: 0;
          text-align: left;
        }
        .site-brand-mark {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--gradient-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }
        .site-brand-name {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.05rem;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          line-height: 1.15;
        }
        .site-brand-sub {
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
          margin-top: 1px;
        }
        .site-desktop-nav {
          display: none;
          align-items: center;
          gap: 0.25rem;
        }
        a.site-nav-link { text-decoration: none; display: inline-flex; align-items: center; }
        a.site-brand { text-decoration: none; color: inherit; }
        .site-nav-link {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.45rem 0.75rem;
          border-radius: 999px;
          font-family: var(--font-body);
        }
        .site-nav-link.is-active {
          color: var(--accent-primary-hover);
          background: rgba(217, 119, 6, 0.08);
        }
        .site-header-actions {
          display: none;
          align-items: center;
          gap: 0.6rem;
        }
        .site-mobile-toggle {
          display: flex;
          width: 40px;
          height: 40px;
          padding: 0;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          border-color: var(--bg-glass-border);
        }
        .site-mobile-drawer {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding: 0.75rem 1.25rem 1.25rem;
          border-top: 1px solid var(--bg-glass-border);
          background: #fff;
        }
        .site-mobile-drawer .site-nav-link {
          text-align: left;
          padding: 0.7rem 0.85rem;
          font-size: 1.05rem;
        }
        @media (min-width: 900px) {
          .site-desktop-nav,
          .site-header-actions { display: flex !important; }
          .site-mobile-toggle,
          .site-mobile-drawer { display: none !important; }
        }
      `}} />

      <div className="site-header-inner">
        <a href="/" className="site-brand" onClick={(event) => { handleInternalNav(event, '/'); go('home'); }}>
          <div className="site-brand-mark">
            <Shield size={20} />
          </div>
          <div>
            <div className="site-brand-name">DVS Pest Control</div>
            <div className="site-brand-sub">Lucknow</div>
          </div>
        </a>

        <nav className="site-desktop-nav" aria-label="Main">
          {NAV_LINKS.map(item => (
            item.id === 'drawings' ? (
              <a
                key={item.id}
                href="/drawings"
                className={`site-nav-link${activeView === 'drawings' ? ' is-active' : ''}`}
                onClick={(event) => { handleInternalNav(event, '/drawings'); go('drawings'); }}
              >
                {item.label}
              </a>
            ) : (
            <button
              key={item.id}
              type="button"
              className={`site-nav-link${isActive(item.id) && activeView !== 'home' ? ' is-active' : ''}${item.id === 'services' && activeView === 'services' ? ' is-active' : ''}`}
              onClick={() => go(item.id)}
            >
              {item.label}
            </button>
            )
          ))}
        </nav>

        <div className="site-header-actions">
          <a href={PHONE_TEL} className="btn btn-outline btn-sm" style={{ textDecoration: 'none' }}>
            <Phone size={15} /> Call
          </a>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => go('consultation')}>
            Book Inspection
          </button>
        </div>

        <button
          type="button"
          className="site-mobile-toggle btn btn-outline btn-sm"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="site-mobile-drawer">
          <button type="button" className={`site-nav-link${activeView === 'home' ? ' is-active' : ''}`} onClick={() => go('home')}>
            Home
          </button>
          {NAV_LINKS.map(item => (
            item.id === 'drawings' ? (
              <a
                key={item.id}
                href="/drawings"
                className={`site-nav-link${activeView === 'drawings' ? ' is-active' : ''}`}
                onClick={(event) => { handleInternalNav(event, '/drawings'); go('drawings'); }}
              >
                {item.label}
              </a>
            ) : (
            <button
              key={item.id}
              type="button"
              className={`site-nav-link${activeView === item.id ? ' is-active' : ''}`}
              onClick={() => go(item.id)}
            >
              {item.label}
            </button>
            )
          ))}
          <a
            href={PHONE_TEL}
            className="btn btn-outline"
            style={{ textDecoration: 'none', justifyContent: 'center', marginTop: '0.5rem' }}
          >
            <Phone size={16} /> Call +91 93304 78897
          </a>
          <button type="button" className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => go('consultation')}>
            Book Inspection
          </button>
          <button type="button" className="btn btn-secondary" style={{ justifyContent: 'center' }} onClick={() => go('virtual-twin')}>
            <MessageCircle size={16} /> Chat with DVS
          </button>
        </div>
      )}
    </header>
  );
};
