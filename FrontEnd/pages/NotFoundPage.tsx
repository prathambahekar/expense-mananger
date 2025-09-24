import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuestionMarkCircleIcon } from '../assets/icons';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10, duration: 0.8 }}
      >
        <QuestionMarkCircleIcon className="w-48 h-48 text-brand-primary" />
      </motion.div>
      <motion.h1 
        className="mt-8 text-6xl md:text-8xl font-extrabold text-text-primary dark:text-dark-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        404
      </motion.h1>
      <motion.p 
        className="mt-4 text-xl md:text-2xl font-semibold text-text-primary dark:text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        Page Not Found
      </motion.p>
      <motion.p 
        className="mt-2 max-w-lg text-text-secondary dark:text-gray-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        The page you are looking for does not exist or has been moved. Let's get you back on track.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="mt-8"
      >
        <NavLink
          to="/"
          className="px-8 py-3 bg-brand-primary hover:opacity-90 text-white font-semibold rounded-lg transition-colors shadow-lg"
        >
          Return Home
        </NavLink>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;