import React from 'react';
import FeaturePageLayout from './FeaturePageLayout';
import { AIIcon } from '../assets/icons';
import Card from '../components/Card';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const AIFeaturesPage: React.FC = () => {
  return (
    <FeaturePageLayout
      title="AI-Powered Features"
      description="Get personalized saving tips and fraud alerts. Our AI analyzes your spending to keep you financially secure."
      Icon={AIIcon}
    >
        <motion.div 
          className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 snap-x snap-mandatory"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
            <motion.div variants={itemVariants} className="flex-shrink-0 w-full max-w-md snap-start">
                <Card>
                    <h2 className="text-2xl font-semibold mb-4">OCR Bill Scanning (Dummy)</h2>
                    <p className="text-text-secondary mb-4">Upload a receipt image and let our AI extract the details for you.</p>
                    <input type="file" className="text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:opacity-80"/>
                </Card>
            </motion.div>
            <motion.div variants={itemVariants} className="flex-shrink-0 w-full max-w-md snap-start">
                <Card>
                    <h2 className="text-2xl font-semibold mb-4">Fraud Detection (Dummy)</h2>
                    <p className="text-text-secondary mb-4">Our systems are constantly monitoring for unusual activity.</p>
                    <div className="p-4 bg-accent-green/10 text-accent-green rounded-lg">
                        <p>No unusual activity detected. Your account is secure.</p>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    </FeaturePageLayout>
  );
};

export default AIFeaturesPage;