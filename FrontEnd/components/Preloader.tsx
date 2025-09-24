import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RocketIcon } from '../assets/icons';

interface PreloaderProps {
  onComplete: () => void;
}

const loadingMessages = [
  "Preparing your dashboard...",
  "Polishing the rockets...",
  "Aligning the stars...",
];

// Variants for the typewriter effect
const sentenceVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.08,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const welcomeText = "Welcome Back!";

  useEffect(() => {
    const totalDuration = 3000; // Total time the preloader is visible
    const onCompleteTimer = setTimeout(onComplete, totalDuration);

    const messageInterval = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
    }, 1000); // Change message every second

    return () => {
      clearTimeout(onCompleteTimer);
      clearInterval(messageInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-light-bg dark:bg-dark-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
      >
        <RocketIcon className="w-24 h-24 text-brand-primary" />
      </motion.div>
      
      <motion.h1
        className="mt-6 text-2xl font-bold text-text-primary dark:text-dark-text"
        variants={sentenceVariants}
        initial="hidden"
        animate="visible"
      >
        {welcomeText.split("").map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={letterVariants}
            style={{ display: 'inline-block' }} // Ensures proper spacing and animation
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.h1>

      <div className="mt-4 h-6 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            className="text-text-secondary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {loadingMessages[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-10 flex space-x-2">
        <motion.div
          className="h-2 w-2 bg-brand-primary rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="h-2 w-2 bg-brand-primary rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.div
          className="h-2 w-2 bg-brand-primary rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </div>
    </motion.div>
  );
};

export default Preloader;