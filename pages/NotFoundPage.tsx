
import React from 'react';
import { Link } from 'react-router-dom';
import { GradientText } from '../components/ui';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center cosmic-background p-4">
      <div className="relative z-10">
        <h1 className="text-9xl font-bold font-[var(--font-heading)]">
          <GradientText>404</GradientText>
        </h1>
        <h2 className="text-3xl font-bold mt-4 mb-2">Lost in Space</h2>
        <p className="text-gray-300 mb-8 max-w-sm">
          The page you're looking for seems to have drifted off into another galaxy.
        </p>
        <Link 
          to="/dashboard" 
          className="px-8 py-3 bg-gradient-to-r from-[var(--color-primary-accent)] to-[var(--color-secondary-accent)] text-black font-bold rounded-lg hover:scale-105 transition-transform"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
