import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { NAV_LINKS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { RocketIcon } from '../assets/icons';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    transition: { type: "spring", stiffness: 500, damping: 30 }
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 30 }
  },
};

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose }) => {
  const { isLoggedIn } = useAuth();
  const logoLink = isLoggedIn ? '/dashboard' : '/';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            transition={{ duration: 0.2 }}
          />
          <motion.aside
            className="fixed bottom-20 left-4 z-50 flex flex-col w-80 max-h-[70vh] rounded-xl bg-light-card/90 dark:bg-dark-bg/80 backdrop-blur-xl border border-light-border dark:border-white/10 shadow-2xl"
            style={{ transformOrigin: 'bottom left' }}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="p-6 border-b border-light-border dark:border-white/10">
              <NavLink to={logoLink} onClick={onClose} className="flex items-center gap-2">
                <RocketIcon className="h-8 w-8 text-brand-primary" />
                <span className="font-bold text-2xl tracking-wider text-text-primary dark:text-white">CosmicSplit</span>
              </NavLink>
            </div>
            
            <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
              {NAV_LINKS.map((link) => {
                if (!isLoggedIn && (link.href === '/dashboard' || link.href === '/settings')) {
                  return null;
                }
                return (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-base font-medium text-text-secondary dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 ${
                        isActive ? 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary font-semibold' : ''
                      }`
                    }
                  >
                    <link.icon className="w-6 h-6 flex-shrink-0" />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidePanel;