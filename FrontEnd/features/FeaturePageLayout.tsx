import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

interface FeaturePageLayoutProps {
  title: string;
  description: string;
  Icon: React.ElementType;
  children: React.ReactNode;
}

// Extracted LoggedOutView to prevent re-creation on parent render
const LoggedOutView: React.FC<Omit<FeaturePageLayoutProps, 'children'>> = ({ title, description, Icon }) => (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl text-center"
      >
        <Card>
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-brand-primary/10 rounded-full">
                    <Icon className="w-12 h-12 text-brand-primary" />
                </div>
            </div>
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-text-secondary mb-8">{description}</p>
          <div className="flex gap-4 justify-center">
            <NavLink to="/login" className="px-6 py-3 bg-brand-primary hover:opacity-90 rounded-lg font-semibold text-white">Login to Use</NavLink>
            <NavLink to="/register" className="px-6 py-3 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-lg font-semibold">Register Now</NavLink>
          </div>
        </Card>
      </motion.div>
    </div>
);

// Extracted LoggedInView to prevent re-creation on parent render
const LoggedInView: React.FC<Pick<FeaturePageLayoutProps, 'title' | 'Icon' | 'children'>> = ({ title, Icon, children }) => (
    <div className="container mx-auto px-4 py-8">
      <div>
        <div className="flex items-center gap-4 mb-8">
            <Icon className="w-10 h-10 text-brand-primary"/>
            <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
);

const FeaturePageLayout: React.FC<FeaturePageLayoutProps> = ({ title, description, Icon, children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn 
    ? <LoggedInView title={title} Icon={Icon}>{children}</LoggedInView> 
    : <LoggedOutView title={title} description={description} Icon={Icon} />;
};

export default FeaturePageLayout;
