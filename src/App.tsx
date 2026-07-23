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
import { CustomerDashboard } from './modules/customer/CustomerDashboard';
import { PestRecognitionAI } from './modules/ai/PestRecognitionAI';
import { AIChatbotWidget } from './modules/ai/AIChatbotWidget';
import { LoginGate } from './modules/admin/LoginGate';
import { security } from './core/security';

export const App: React.FC = () => {
  const [mode, setMode] = useState<NavigationMode>('public');
  const [publicView, setPublicView] = useState('home');
  
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

  // Intercept mode switching to gate Admin panels with Firebase Auth
  const handleModeChange = (targetMode: NavigationMode) => {
    if (targetMode === 'admin' && !security.getSession().isAuthenticated) {
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
            {publicView === 'consultation' && <ConsultationForm />}
            {publicView === 'blogs' && <BlogsPage />}
            {publicView === 'gallery' && <GalleryPage />}
          </main>
          <PublicFooter />
          <AIChatbotWidget />
        </>
      )}

      {/* Mode 2: SaaS Dashboard (Admin or Customer Portal depending on Role) */}
      {mode === 'admin' && (
        session.userRole === 'Administrator' ? (
          <AdminLayout setMode={handleModeChange} />
        ) : (
          <CustomerDashboard setMode={handleModeChange} />
        )
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
