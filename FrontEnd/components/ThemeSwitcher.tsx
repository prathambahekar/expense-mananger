import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon } from '../assets/icons';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-12 flex items-center justify-center rounded-lg bg-light-card/80 dark:bg-black/20 backdrop-blur-lg border border-light-border dark:border-white/20 shadow-lg focus:outline-none transition-colors overflow-hidden"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative z-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme + '-icon'}
            initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 90 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {theme === 'light' 
              ? <SunIcon className="w-6 h-6 text-orange-500" /> 
              : <MoonIcon className="w-6 h-6 text-sky-300" />}
          </motion.div>
        </AnimatePresence>
      </div>
    </button>
  );
};

export default ThemeSwitcher;