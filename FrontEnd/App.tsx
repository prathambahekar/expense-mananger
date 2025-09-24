import React, { useState, useEffect } from 'react';
// FIX: Import Outlet for use in the refactored ProtectedRoute component.
import { HashRouter, Routes, Route, useLocation, Outlet, Navigate, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';

import Navbar from './components/Navbar';
import SidePanel from './components/SidePanel';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutModal from './components/AboutModal';
import Preloader from './components/Preloader'; // Import Preloader
import Tooltip from './components/Tooltip';

import ExpenseLoggingPage from './features/ExpenseLoggingPage';
import GroupManagementPage from './features/GroupManagementPage';
import SettlementsPage from './features/SettlementsPage';
import ReportsPage from './features/ReportsPage';
import AIFeaturesPage from './features/AIFeaturesPage';
import IntegrationsPage from './features/IntegrationsPage';
import GamificationPage from './features/GamificationPage';
import LoadingSpinner from './components/LoadingSpinner';
import ThemeSwitcher from './components/ThemeSwitcher';
import { InfoIcon, MenuIcon, CloseIcon } from './assets/icons';

const pageVariants = {
  initial: { opacity: 0, x: 30, scale: 0.98 },
  in: { opacity: 1, x: 0, scale: 1 },
  out: { opacity: 0, x: -30, scale: 0.98 },
};

const pageTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 40,
};

function AnimatedOutlet() {
    const outlet = useOutlet();
    const location = useLocation();
    
    // Don't animate the auth page since it has its own animations
    if (location.pathname === '/login' || location.pathname === '/register') {
        return outlet;
    }
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
                {outlet}
            </motion.div>
        </AnimatePresence>
    );
}

// FIX: Refactor ProtectedRoute to work as a layout route component with Outlet.
function ProtectedRoute() {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }
  // FIX: Remove CurrencyProvider from here as it's moved up the component tree to wrap all routes.
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

function MainLayout() {
  const location = useLocation();
  const [isSidePanelOpen, setSidePanelOpen] = useState(false);
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const { isPreloading, finishPreloading } = useAuth(); // Add auth state
  
  useEffect(() => {
    const isOverlayOpen = isAboutModalOpen || isSidePanelOpen;
    if (isOverlayOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isAboutModalOpen, isSidePanelOpen]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="relative min-h-screen bg-light-bg dark:bg-dark-bg text-text-primary dark:text-dark-text">
      <AnimatePresence>
        {isPreloading && <Preloader onComplete={finishPreloading} />}
      </AnimatePresence>
      
      <Navbar />
      <SidePanel isOpen={isSidePanelOpen} onClose={() => setSidePanelOpen(false)} />
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setAboutModalOpen(false)} />
      
      <main className={`relative z-10 ${isAuthPage ? '' : 'pt-24'}`}>
        <AnimatedOutlet />
      </main>

      <button 
        onClick={() => setSidePanelOpen(!isSidePanelOpen)}
        className="fixed bottom-4 left-4 z-50 w-12 h-12 flex items-center justify-center rounded-lg bg-light-card/80 dark:bg-dark-bg/20 backdrop-blur-lg border border-light-border dark:border-white/20 shadow-lg text-text-primary dark:text-dark-text"
        aria-label={isSidePanelOpen ? "Close menu" : "Open menu"}
      >
        <AnimatePresence initial={false} mode="wait">
          {isSidePanelOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <CloseIcon />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <MenuIcon />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
        <Tooltip content="About CosmicSplit">
            <button 
              onClick={() => setAboutModalOpen(true)}
              className="w-12 h-12 flex items-center justify-center rounded-lg bg-light-card/80 dark:bg-dark-bg/20 backdrop-blur-lg border border-light-border dark:border-white/20 shadow-lg text-brand-primary"
              aria-label="About CosmicSplit"
            >
              <InfoIcon />
            </button>
        </Tooltip>
        <Tooltip content="Switch Theme">
            <div>
              <ThemeSwitcher />
            </div>
        </Tooltip>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
          {/* FIX: Wrap all routes in CurrencyProvider to make currency context globally available to all components. */}
          <CurrencyProvider>
            <HashRouter>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<LandingPage />} />
                  <Route path="login" element={<AuthPage />} />
                  <Route path="register" element={<AuthPage />} />
                  
                  <Route element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                  
                  {/* Feature pages are publicly accessible; they handle auth state internally */}
                  <Route path="features/expenses" element={<ExpenseLoggingPage />} />
                  <Route path="features/groups" element={<GroupManagementPage />} />
                  <Route path="features/settlements" element={<SettlementsPage />} />
                  <Route path="features/reports" element={<ReportsPage />} />
                  <Route path="features/ai" element={<AIFeaturesPage />} />
                  <Route path="features/integrations" element={<IntegrationsPage />} />
                  <Route path="features/gamification" element={<GamificationPage />} />
                  
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </HashRouter>
          </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}