import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RocketIcon } from '../assets/icons';
import { NAV_LINKS } from '../constants';

const NavItem: React.FC<{ to: string; children: React.ReactNode; }> = ({ to, children }) => (
    <NavLink 
        to={to} 
        className="text-sm font-medium text-text-secondary hover:text-brand-primary dark:text-gray-300 dark:hover:text-brand-primary transition-colors"
    >
        {children}
    </NavLink>
);

const Navbar: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logoLink = isLoggedIn ? '/dashboard' : '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPageName = (pathname: string): string => {
      if (pathname === '/') return 'Home';

      const navLink = NAV_LINKS.find(link => link.href === pathname);
      if (navLink) return navLink.name;
      
      if (pathname === '/login' || pathname === '/register') return 'Authenticate';
      
      const pathSegments = pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
          const lastSegment = pathSegments[pathSegments.length - 1];
          return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
      }

      return 'CosmicSplit';
  };

  const currentPageName = getPageName(location.pathname);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-6xl bg-light-card/80 dark:bg-dark-bg/70 backdrop-blur-lg border border-light-border dark:border-white/10 shadow-lg rounded-xl">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-16">

          {/* Left Section - Current Page Indicator */}
          <div className="justify-self-start min-w-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100/80 dark:bg-white/10">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-accent-green animate-pulse" title="Current Location"></span>
                <span className="truncate text-sm font-medium text-text-primary dark:text-dark-text">{currentPageName}</span>
            </div>
          </div>

          {/* Center Section */}
          <div className="justify-self-center">
             <NavLink to={logoLink} className="flex-shrink-0 flex items-center gap-2 text-text-primary dark:text-white">
              <RocketIcon className="h-7 w-7 text-brand-primary" />
              <span className="hidden md:inline font-bold text-xl tracking-wider">CosmicSplit</span>
            </NavLink>
          </div>

          {/* Right Section */}
          <div className="justify-self-end flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-6">
                {isLoggedIn ? (
                    <>
                        <NavItem to="/dashboard">Dashboard</NavItem>
                        <button onClick={handleLogout} className="text-sm font-medium text-text-secondary hover:text-brand-primary dark:text-gray-300 dark:hover:text-brand-primary transition-colors">Logout</button>
                    </>
                ) : (
                    <NavItem to="/login">Authenticate</NavItem>
                )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;