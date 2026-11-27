import React, { useState, useEffect } from 'react';
import { NavigationMode, Customer } from './core/types';
import { PublicNavigation } from './modules/public/PublicNavigation';
import { PublicFooter } from './modules/public/PublicFooter';
import { HomePage } from './modules/public/HomePage';
import { ServicesPage } from './modules/public/ServicesPage';
import { ConsultationForm } from './modules/public/ConsultationForm';
import { BlogsPage } from './modules/public/BlogsPage';
import { GalleryPage } from './modules/public/GalleryPage';
import { InfrastructurePage } from './modules/public/InfrastructurePage';
import { UnderConstructionPage } from './modules/public/UnderConstructionPage';
import { VirtualTwinPage } from './modules/public/VirtualTwinPage';
import { DrawingsPage } from './modules/public/DrawingsPage';
import { DrawingsLandingPage } from './modules/public/DrawingsLandingPage';
import { DRAWINGS_HUB, matchSeoRoute, normalizePath } from './seo/routes';
import { drawingsHead, homeHead } from './seo/head';
import { draftingJsonLd, pestControlJsonLd } from './seo/jsonld';
import { usePageSeo } from './seo/usePageSeo';
import { SITE_URL } from './seo/constants';
import { CustomerDirectory } from './modules/crm/CustomerDirectory';
import { CustomerProfileDetail } from './modules/crm/CustomerProfileDetail';
import { LeadPipeline } from './modules/crm/LeadPipeline';
import { AdminLayout } from './modules/admin/AdminLayout';
import { CustomerDashboard } from './modules/customer/CustomerDashboard';
import { PestRecognitionAI } from './modules/ai/PestRecognitionAI';
import { AIChatbotWidget } from './modules/ai/AIChatbotWidget';
import { StickyContactBar } from './modules/public/StickyContactBar';
import { LoginGate } from './modules/admin/LoginGate';
import { security } from './core/security';

export const App: React.FC = () => {
  const [mode, setMode] = useState<NavigationMode>('public');
  const initialPath = typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/';
  const initialPublicView = initialPath === '/drawings' || initialPath.startsWith('/drawings/') ? 'drawings' : 'home';
  const [publicView, setPublicView] = useState(initialPublicView);
  const [currentPath, setCurrentPath] = useState(initialPath);
  const seoRoute = matchSeoRoute(currentPath);

  const applyPath = (path: string, view?: string) => {
    const normalized = normalizePath(path);
    setCurrentPath(normalized);
    if (normalized === '/drawings' || normalized.startsWith('/drawings/')) {
      setPublicView('drawings');
    } else if (view) {
      setPublicView(view);
    } else if (publicView === 'drawings') {
      setPublicView('home');
    }
  };

  const handlePublicView = (view: string) => {
    const path = view === 'drawings' ? '/drawings' : '/';
    setPublicView(view);
    setCurrentPath(path);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  };

  const drawingsHeadTags = seoRoute
    ? drawingsHead(
        seoRoute.title,
        seoRoute.description,
        seoRoute.path,
        draftingJsonLd(`${SITE_URL}${seoRoute.path}`, seoRoute.faqs),
        seoRoute.lang,
      )
    : currentPath.startsWith('/drawings/')
      ? drawingsHead(DRAWINGS_HUB.title, DRAWINGS_HUB.description, '/drawings', draftingJsonLd(`${SITE_URL}/drawings`, DRAWINGS_HUB.faqs))
      : currentPath === '/drawings'
        ? drawingsHead(DRAWINGS_HUB.title, DRAWINGS_HUB.description, '/drawings', draftingJsonLd(`${SITE_URL}/drawings`, DRAWINGS_HUB.faqs))
        : homeHead(pestControlJsonLd());

  usePageSeo(mode === 'public' ? drawingsHeadTags : null);

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

  useEffect(() => {
    const onPopState = () => {
      const path = normalizePath(window.location.pathname);
      setCurrentPath(path);
      if (path === '/drawings' || path.startsWith('/drawings/')) {
        setPublicView('drawings');
      } else {
        setPublicView((view) => (view === 'drawings' ? 'home' : view));
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
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
          <PublicNavigation activeView={publicView} setActiveView={handlePublicView} setMode={handleModeChange} />
          <main style={{ flexGrow: 1 }}>
            {publicView === 'home' && <HomePage onBookClick={() => handlePublicView('consultation')} onServicesClick={() => handlePublicView('services')} onChatClick={() => handlePublicView('virtual-twin')} onDrawingsClick={() => handlePublicView('drawings')} />}
            {publicView === 'services' && <ServicesPage onBookClick={() => handlePublicView('consultation')} />}
            {publicView === 'consultation' && <ConsultationForm />}
            {publicView === 'blogs' && <BlogsPage />}
            {publicView === 'gallery' && <GalleryPage />}
            {publicView === 'infrastructure' && <InfrastructurePage />}
            {publicView === 'under-construction' && <UnderConstructionPage />}
            {publicView === 'virtual-twin' && <VirtualTwinPage onBookClick={() => handlePublicView('consultation')} />}
            {publicView === 'drawings' && currentPath === '/drawings' && <DrawingsPage />}
            {publicView === 'drawings' && seoRoute && seoRoute.kind !== 'hub' && <DrawingsLandingPage route={seoRoute} />}
            {publicView === 'drawings' && currentPath.startsWith('/drawings/') && !seoRoute && (
              <div className="page-content-over-game" style={{ maxWidth: '720px', margin: '4rem auto', padding: '2rem 1.5rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Page not found</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>That drawings page does not exist.</p>
                <a href="/drawings" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Back to house drawings</a>
              </div>
            )}
          </main>
          <PublicFooter
            onChatClick={() => { handlePublicView('virtual-twin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onDrawingsClick={() => { handlePublicView('drawings'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onServicesClick={() => { handlePublicView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onContactClick={() => { handlePublicView('consultation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onLoginClick={() => handleModeChange('admin')}
          />
          <StickyContactBar />
          <div className="site-chatbot"><AIChatbotWidget /></div>
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

          <main style={{ flexGrow: 1 }}>
            <PestRecognitionAI />
          </main>
          <div className="site-chatbot"><AIChatbotWidget /></div>
        </div>
      )}

    </div>
  );
};
