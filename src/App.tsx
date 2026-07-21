import React, { useState, useEffect } from 'react';
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
import { LoginGate } from './modules/admin/LoginGate';
import { security } from './core/security';
import { Users, Kanban } from 'lucide-react';

export const App: React.FC = () => {
  const [mode, setMode] = useState<NavigationMode>('public');
  const [publicView, setPublicView] = useState('home');
  const [crmView, setCrmView] = useState<'directory' | 'detail' | 'kanban'>('directory');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Security session monitoring
  const [session, setSession] = useState(security.getSession());
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [pendingMode, setPendingMode] = useState<NavigationMode | null>(null);

  useEffect(() => {
    // Subscribe to security session changes (fired on Firebase Auth status changes)
    const unsubscribe = security.subscribe(() => {
      setSession(security.getSession());
    });
    return () => unsubscribe();
  }, []);

  // Intercept mode switching to gate CRM and Admin panels with Firebase Auth
  const handleModeChange = (targetMode: NavigationMode) => {
    if ((targetMode === 'crm' || targetMode === 'admin') && !security.getSession().isAuthenticated) {
      setPendingMode(targetMode);
      setShowLoginGate(true);
    } else {
      setMode(targetMode);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginGate(false);
    if (pendingMode) {
      setMode(pendingMode);
      setPendingMode(null);
    }
  };

  const handleLoginCancel = () => {
    setShowLoginGate(false);
    setPendingMode(null);
    setMode('public');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Firebase Authentication Overlay Gate */}
      {showLoginGate && (
        <LoginGate onSuccess={handleLoginSuccess} onCancel={handleLoginCancel} />
      )}

      {/* Mode 1: Public Website Portal */}
      {mode === 'public' && (
        <>
          <PublicNavigation activeView={publicView} setActiveView={setPublicView} setMode={handleModeChange} />
          <main style={{ flexGrow: 1, padding: '2rem 0' }}>
            {publicView === 'home' && <HomePage onBookClick={() => setPublicView('consultation')} onServicesClick={() => setPublicView('services')} />}
            {publicView === 'services' && <ServicesPage onBookClick={() => setPublicView('consultation')} />}
            {publicView === 'consultation' && <ConsultationForm onSuccess={() => handleModeChange('crm')} />}
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
        <AdminLayout setMode={handleModeChange} />
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
