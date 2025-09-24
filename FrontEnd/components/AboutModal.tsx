
import React from 'react';
// FIX: Import Variants type from framer-motion to resolve type inference issue.
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Card from './Card';
import { RocketIcon, CloseIcon } from '../assets/icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// FIX: Explicitly type backdropVariants as Variants to fix type inference issue.
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// FIX: Explicitly type modalVariants as Variants to fix type inference issue with transition type.
const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { opacity: 0, scale: 0.95, y: -50, transition: { duration: 0.2 } }
};

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-modal-title"
            onClick={onClose}
          >
            {/* FIX: Wrap Card in a div to handle click propagation without causing a type error on Card's onClick prop. The wrapper div now handles stopping propagation. */}
            <div 
              className="relative w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary dark:hover:text-white transition-colors" aria-label="Close modal">
                  <CloseIcon />
                </button>

                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                      <RocketIcon className="w-12 h-12 text-brand-primary" />
                  </div>
                  <h1 id="about-modal-title" className="text-3xl sm:text-4xl font-bold mb-2">About CosmicSplit</h1>
                  <p className="text-md text-text-secondary">
                    Forged in the crucible of innovation and collaboration.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold border-b border-light-border dark:border-white/10 pb-3 mb-4 text-left">Our Origin Story</h2>
                  <div className="space-y-4 text-text-secondary leading-relaxed text-left">
                      <p>
                          CosmicSplit is a student-led initiative brought to life by a passionate and multidisciplinary team from the{' '}
                          <span className="font-semibold text-brand-primary">
                              Dr. D. Y. Patil Institute of Technology.
                          </span>
                      </p>
                      <p>
                          Our project represents the synergy of diverse fields of study, from cutting-edge web development and intuitive UI/UX design to the complex realms of artificial intelligence and data science. We came together with a shared vision: to build a real-world, top-notch financial technology application that solves a common problem with elegance and power.
                      </p>
                      <p>
                          This platform is a testament to our dedication, our hands-on approach to learning, and our commitment to excellence. We are proud to present CosmicSplit as a showcase of the talent and collaborative spirit nurtured at our institution.
                      </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AboutModal;
