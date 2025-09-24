

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiPlusCircle, FiTrendingUp, FiUser, FiLogOut, FiBell, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

// FIX: Alias motion components to local variables to help TypeScript with type inference.
const MotionDiv = motion.div;
const MotionAside = motion.aside;

const CosmicBackground: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div className={`absolute inset-0 w-full h-full cosmic-background z-0 ${theme === 'dark' ? 'opacity-40' : 'opacity-10'
      }`}></div>
  );
};

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: FiHome },
  { name: 'Groups', path: '/groups', icon: FiUsers },
  { name: 'Settlements', path: '/settlements', icon: FiTrendingUp },
  { name: 'Profile', path: '/profile', icon: FiUser },
];

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 bg-[var(--color-background)]/80 backdrop-blur-md h-16 flex items-center justify-between px-4 md:px-6 z-40 border-b border-[var(--border-color)] shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden text-2xl">
          <FiMenu />
        </button>
        <img src="/logo.svg" alt="Logo" className="h-8 hidden sm:block" />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-2xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
          <FiBell />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[var(--color-primary-accent)]"></span>
        </button>
        <button
          onClick={toggleTheme}
          className="text-2xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-2"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>
        <div className="flex items-center gap-2">
          <img src={user?.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}`} alt="avatar" className="h-8 w-8 rounded-full" />
          <span className="hidden md:block font-medium">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const NavLinkItem: React.FC<{ item: typeof navItems[0] }> = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-[var(--color-text-primary)] transition-all ${isActive ? 'bg-white/10 text-[var(--color-text-primary)] font-semibold' : ''
        }`
      }
    >
      <item.icon className="text-xl" />
      <span className="text-md">{item.name}</span>
    </NavLink>
  );

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={onClose}
            />
            <MotionAside
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-[var(--color-background-light)] p-4 z-50 flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <img src="/logo.svg" alt="Logo" className="h-8" />
                <button onClick={onClose} className="text-2xl"><FiX /></button>
              </div>
              <nav className="flex flex-col gap-2 flex-grow">
                {navItems.map(item => <NavLinkItem key={item.path} item={item} />)}
                <NavLink
                  to="/groups/all/expenses/new"
                  onClick={onClose}
                  className="mt-4 flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-white bg-gradient-to-r from-[var(--color-primary-accent)] to-[var(--color-secondary-accent)] hover:scale-105 transition-transform"
                >
                  <FiPlusCircle className="text-xl" />
                  <span className="font-bold">Add Expense</span>
                </NavLink>
              </nav>
              <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all">
                <FiLogOut className="text-xl" />
                <span className="text-md">Logout</span>
              </button>
            </MotionAside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[var(--color-background-light)] p-4 fixed h-full border-r border-[var(--border-color)]">
        <div className="mb-10 mt-2">
          <img src="/logo.svg" alt="Logo" className="h-8" />
        </div>
        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map(item => <NavLinkItem key={item.path} item={item} />)}
        </nav>
        <div className="mb-4">
          <NavLink
            to="/groups/all/expenses/new"
            className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-white bg-gradient-to-r from-[var(--color-primary-accent)] to-[var(--color-secondary-accent)] hover:scale-105 transition-transform"
          >
            <FiPlusCircle className="text-xl" />
            <span className="font-bold">Add Expense</span>
          </NavLink>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all">
          <FiLogOut className="text-xl" />
          <span className="text-md">Logout</span>
        </button>
      </aside>
    </>
  );
};


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="min-h-screen text-[var(--color-text-primary)] bg-[var(--color-background)]">
      <CosmicBackground />
      <div className="relative z-10 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 md:ml-64">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 md:p-8 pt-20">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;