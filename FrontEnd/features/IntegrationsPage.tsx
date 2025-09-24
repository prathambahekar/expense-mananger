import React from 'react';
import FeaturePageLayout from './FeaturePageLayout';
import { IntegrationIcon } from '../assets/icons';
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

const integrations = [
    { name: 'PayPal', connected: true, logo: 'https://picsum.photos/seed/paypal/48/48' },
    { name: 'Venmo', connected: false, logo: 'https://picsum.photos/seed/venmo/48/48' },
    { name: 'UPI', connected: false, logo: 'https://picsum.photos/seed/upi/48/48' },
    { name: 'Stripe', connected: true, logo: 'https://picsum.photos/seed/stripe/48/48' },
]

const IntegrationsPage: React.FC = () => {
  return (
    <FeaturePageLayout
      title="Seamless Integrations"
      description="Connect with your favorite payment apps like PayPal, Venmo, and UPI for quick and easy settlements."
      Icon={IntegrationIcon}
    >
      <motion.div 
        className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 snap-x snap-mandatory"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {integrations.map((int, index) => (
            <motion.div key={index} variants={itemVariants} className="flex-shrink-0 w-64 sm:w-72 snap-start">
              <Card className="h-full flex flex-col items-center justify-center text-center">
                <img src={int.logo} alt={`${int.name} logo`} className="w-12 h-12 rounded-full mb-4" />
                <p className="font-semibold text-xl mb-4">{int.name}</p>
                <button className={`w-full mt-auto px-4 py-2 rounded-lg text-sm font-semibold ${int.connected ? 'bg-accent-green/20 text-accent-green cursor-default' : 'bg-brand-primary hover:opacity-90 text-white'}`}>
                    {int.connected ? 'Connected' : 'Connect'}
                </button>
              </Card>
            </motion.div>
        ))}
      </motion.div>
    </FeaturePageLayout>
  );
};

export default IntegrationsPage;