
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-brand-primary animate-subtle-spin"></div>
      <p className="text-lg font-medium text-text-secondary">
        Loading...
      </p>
    </div>
  );
};

export default LoadingSpinner;