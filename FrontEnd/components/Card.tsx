import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-light-card dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-lg border border-light-border dark:border-white/10 p-6 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;