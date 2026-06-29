import React, { useState } from 'react';
import { NavigationMode, Customer } from './core/types';
import { PublicNavigation } from './modules/public/PublicNavigation';
import { PublicFooter } from './modules/public/PublicFooter';
import { HomePage } from './modules/public/HomePage';
import { ServicesPage } from './modules/public/ServicesPage';
import { ConsultationForm } from './modules/public/ConsultationForm';
import { BlogsPage } from './modules/public/BlogsPage';
import { GalleryPage } from './modules/public/GalleryPage';
import { CustomerDirectory } from './modules/crm/CustomerDirectory';
import { CustomerProfileDetail } from './modules/crm/CustomerProfileDetail';
import { LeadPipeline } from './modules/crm/LeadPipeline';
import { AdminLayout } from './modules/admin/AdminLayout';
import { PestRecognitionAI } from './modules/ai/PestRecognitionAI';
import { AIChatbotWidget } from './modules/ai/AIChatbotWidget';
import { UserCheck, Users, Kanban } from 'lucide-react';

export const App: React.FC = () => {
  const [mode, setMode] = useState<NavigationMode>('public');
  const [publicView, setPublicView] = useState('home');
  const [crmView, setCrmView] = useState<'directory' | 'detail' | 'kanban'>('directory');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Mode 1: Public Website Portal */}
      {mode === 'public' && (
        <>
          <PublicNavigation activeView={publicView} setActiveView={setPublicView} setMode={setMode} />
          <main style={{ flexGrow: 1, padding: '2rem 0' }}>
            {publicView === 'home' && <HomePage onBookClick={() => setPublicView('consultation')} onServicesClick={() => setPublicView('services')} />}
            {publicView === 'services' && <ServicesPage onBookClick={() => setPublicView('consultation')} />}
            {publicView === 'consultation' && <ConsultationForm onSuccess={() => setMode('crm')} />}
            {publicView === 'blogs' && <BlogsPage />}
            {publicView === 'gallery' && <GalleryPage />}
          </main>
          <PublicFooter />
          <AIChatbotWidget />
        </>
      )}

      {/* Mode 2: Enterprise CRM */}
      {mode === 'crm' && (
        <div style={{ flexGrow: 1, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
          <header className="glass-panel" style={{ padding: '1rem 2rem', borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent-primary)' }}>ENTERPRISE CRM</span>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className={`btn btn-sm ${crmView === 'directory' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setCrmView('directory'); setSelectedCustomer(null); }}>
                  <Users size={16} /> Customer Master Directory
                </button>
                <button className={`btn btn-sm ${crmView === 'kanban' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCrmView('kanban')}>
                  <Kanban size={16} /> Lead Pipeline Kanban
                </button>
              </div>
            </div>

            <button className="btn btn-outline btn-sm" onClick={() => setMode('public')}>
              Exit to Public Portal
            </button>
          </header>

          <main style={{ flexGrow: 1 }}>
            {crmView === 'directory' && !selectedCustomer && (
              <CustomerDirectory onSelectCustomer={cust => { setSelectedCustomer(cust); setCrmView('detail'); }} />
            )}
            {crmView === 'detail' && selectedCustomer && (
              <CustomerProfileDetail customer={selectedCustomer} onBack={() => { setSelectedCustomer(null); setCrmView('directory'); }} />
            )}
            {crmView === 'kanban' && <LeadPipeline />}
          </main>
          <AIChatbotWidget />
        </div>
      )}

      {/* Mode 3: Administrator SaaS Dashboard */}
      {mode === 'admin' && (
        <AdminLayout setMode={setMode} />
      )}

      {/* Mode 4: AI Diagnostic Studio */}
      {mode === 'ai' && (
        <div style={{ flexGrow: 1, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
          <header className="glass-panel" style={{ padding: '1rem 2rem', borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent-primary)' }}>AI DIAGNOSTIC NEURAL STUDIO</span>
            <button className="btn btn-outline btn-sm" onClick={() => setMode('public')}>
              Exit to Public Portal
            </button>
          </header>

          <main style={{ flexGrow: 1, padding: '2rem 0' }}>
            <PestRecognitionAI />
          </main>
          <AIChatbotWidget />
        </div>
      )}

    </div>
  );
};
