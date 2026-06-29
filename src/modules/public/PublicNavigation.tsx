import React, { useState, useEffect } from 'react';
import { Shield, Phone, Calendar, Moon, Sun, LayoutDashboard, UserCheck, Bot } from 'lucide-react';
import { NavigationMode } from '../../core/types';
import { store } from '../../core/store';

interface Props {
  activeView: string;
  setActiveView: (view: string) => void;
  setMode: (mode: NavigationMode) => void;
}

export const PublicNavigation: React.FC<Props> = ({ activeView, setActiveView, setMode }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(store.getSettings().theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    store.updateSettings({ theme: nextTheme });
  };

  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveView('home')}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: 'var(--shadow-glow)' }}>
            <Shield size={24} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ANTI-GRAVITY
            </div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-secondary)', marginTop: '-2px' }}>
              ENTERPRISE ECOSYSTEM
            </div>
          </div>
        </div>

        {/* Public Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', '@media (maxWidth: 768px)': { display: 'none' } }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'services', label: 'Services & Pricing' },
            { id: 'consultation', label: 'Book Consultation' },
            { id: 'gallery', label: 'Before & After' },
            { id: 'blogs', label: 'Insights & Blog' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeView === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: activeView === item.id ? 600 : 500,
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

        {/* Portal Switching & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button className="btn btn-outline btn-sm" onClick={() => setMode('ai')}>
            <Bot size={16} /> AI Studio
          </button>

          <button className="btn btn-secondary btn-sm" onClick={() => setMode('crm')}>
            <UserCheck size={16} /> CRM
          </button>

          <button className="btn btn-primary btn-sm" onClick={() => setMode('admin')}>
            <LayoutDashboard size={16} /> Admin SaaS
          </button>
        </div>

      </div>
    </header>
  );
};
