import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, UserCheck, Briefcase, Settings, Star, 
  MessageSquare, FileText, Image, DollarSign, MapPin, FolderArchive, 
  BarChart2, Mail, Bell, Globe, Search, Bot, Shield, Calendar, LogOut, ChevronRight
} from 'lucide-react';
import { store } from '../../core/store';
import { security } from '../../core/security';
import { NavigationMode } from '../../core/types';
import { AdminOverview } from './AdminOverview';
import { AdminModulesManager } from './AdminModules';

interface Props {
  setMode: (mode: NavigationMode) => void;
}

export const AdminLayout: React.FC<Props> = ({ setMode }) => {
  const [activeModule, setActiveModule] = useState('overview');
  const [globalQuery, setGlobalQuery] = useState('');
  const session = security.getSession();

  const menuItems = [
    { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer Master', icon: Users },
    { id: 'leads', label: 'Lead Pipeline', icon: UserCheck },
    { id: 'employees', label: 'Technicians Roster', icon: Briefcase },
    { id: 'services', label: 'Services & Rates (₹)', icon: Settings },
    { id: 'requests', label: 'Inspection Requests', icon: MessageSquare },
    { id: 'calendar', label: 'Lucknow Dispatch', icon: Calendar },
    { id: 'feedback', label: 'Feedback Moderation', icon: Star },
    { id: 'reviews', label: 'Customer Reviews', icon: Star },
    { id: 'blogs', label: 'Pest Science Blog CMS', icon: FileText },
    { id: 'gallery', label: 'Media & Gallery CMS', icon: Image },
    { id: 'pricing', label: 'Pricing Manager (₹)', icon: DollarSign },
    { id: 'areas', label: 'Areas Covered (UP)', icon: MapPin },
    { id: 'documents', label: 'Documents Vault', icon: FolderArchive },
    { id: 'reports', label: 'Executive Reports', icon: BarChart2 },
    { id: 'analytics', label: 'Business Analytics', icon: BarChart2 },
    { id: 'email', label: 'Email Center', icon: Mail },
    { id: 'notifications', label: 'Notifications Hub', icon: Bell },
    { id: 'cms', label: 'Website CMS', icon: Globe },
    { id: 'seo', label: 'SEO Manager', icon: Search },
    { id: 'ai-studio', label: 'AI Pest Studio', icon: Bot },
    { id: 'settings', label: 'System Settings', icon: Shield }
  ];

  const searchResults = globalQuery ? store.globalSearch(globalQuery) : null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      
      {/* SaaS Sidebar Navigation */}
      <aside className="glass-panel" style={{ width: '280px', minWidth: '280px', borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none', display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', zIndex: 10, background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem 1.5rem 0.5rem', borderBottom: '1px solid var(--bg-glass-border)', marginBottom: '1.5rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Shield size={24} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem', background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
              DVS PEST CONTROL
            </div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              LUCKNOW SAAS ENGINE
            </div>
          </div>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingRight: '0.25rem' }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isActive ? 'var(--accent-primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={18} style={{ color: isActive ? '#ffffff' : 'var(--text-muted)' }} />
                <span style={{ flexGrow: 1 }}>{item.label}</span>
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}
        </div>

        <div style={{ borderTop: '1px solid var(--bg-glass-border)', paddingTop: '1rem', marginTop: '1rem' }}>
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => setMode('public')}>
            <LogOut size={16} /> Exit to Public Portal
          </button>
        </div>
      </aside>

      {/* Main Administrative Workplace */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        
        {/* Top Header Bar */}
        <header className="glass-panel" style={{ padding: '1rem 2rem', borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', background: '#ffffff' }}>
          
          {/* Global Search Bar */}
          <div style={{ position: 'relative', width: '400px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Global Search (Customers, Leads, Blogs, Invoices)..."
              value={globalQuery}
              onChange={e => setGlobalQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />

            {/* Global Search Results Dropdown */}
            {searchResults && (globalQuery.trim().length > 0) && (
              <div className="glass-panel animate-fade-in" style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#ffffff', padding: '1rem', zIndex: 100, maxHeight: '350px', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>SEARCH RESULTS</div>
                {searchResults.customers.map(c => (
                  <div key={c.id} style={{ padding: '0.5rem', borderBottom: '1px solid var(--bg-glass-border)', cursor: 'pointer' }} onClick={() => { setActiveModule('customers'); setGlobalQuery(''); }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>👤 {c.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer • {c.email}</div>
                  </div>
                ))}
                {searchResults.leads.map(l => (
                  <div key={l.id} style={{ padding: '0.5rem', borderBottom: '1px solid var(--bg-glass-border)', cursor: 'pointer' }} onClick={() => { setActiveModule('leads'); setGlobalQuery(''); }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>📋 {l.customerName} ({l.id})</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lead • {l.serviceRequested}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin User Profile Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                DVS
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Lucknow Admin HQ</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>{session.userRole} • 2FA Active</div>
              </div>
            </div>
          </div>

        </header>

        {/* Dynamic SaaS Module Content Container */}
        <div style={{ padding: '2rem', flexGrow: 1 }}>
          {activeModule === 'overview' ? <AdminOverview /> : <AdminModulesManager activeModule={activeModule} />}
        </div>

      </main>

    </div>
  );
};
