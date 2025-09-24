


import React, { useState } from 'react';
// FIX: Changed import to include HTMLMotionProps for correct button prop typing.
import { motion, AnimatePresence, type HTMLMotionProps } from 'framer-motion';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import type { UseFormRegisterReturn } from 'react-hook-form';

// FIX: Alias motion components to local variables to help TypeScript with type inference.
const MotionDiv = motion.div;
const MotionButton = motion.button;

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <MotionDiv
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-[var(--color-background-lighter)] border border-[var(--border-color)] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold font-[var(--font-heading)]">{title}</h2>
              <button onClick={onClose} className="text-2xl text-gray-400 hover:text-white transition-colors">
                <FiX />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};

// --- LoadingSpinner ---
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };
  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-[var(--color-primary-accent)] ${sizeClasses[size]}`}></div>
  );
};

// --- SkeletonLoader ---
interface SkeletonLoaderProps {
  className?: string;
}
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className }) => {
  return <div className={`bg-white/10 animate-pulse rounded-lg ${className}`}></div>;
};

// --- GradientText ---
interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}
export const GradientText: React.FC<GradientTextProps> = ({ children, className }) => {
  return <span className={`gradient-text ${className}`}>{children}</span>;
};

// --- Form Elements ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  register: UseFormRegisterReturn;
}
export const Input: React.FC<InputProps> = ({ label, error, register, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      {...register}
      {...props}
      className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/20'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary-accent)] transition-all`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);


interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}
export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
      onFileChange(file);
    } else {
      setPreview(null);
      setFileName(null);
      onFileChange(null);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">Receipt (Optional)</label>
      <div className="relative w-full h-32 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center text-center p-4 hover:border-[var(--color-primary-accent)] transition-colors">
        <FiUploadCloud className="text-3xl text-gray-400" />
        <p className="text-sm text-gray-400 mt-2">Drag & drop or click to upload</p>
        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
      </div>
      {preview && (
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
          <img src={preview} alt="Receipt preview" className="w-12 h-12 object-cover rounded-md" />
          <p className="text-sm text-gray-300 truncate">{fileName}</p>
        </div>
      )}
    </div>
  );
}

// --- Button ---
// FIX: Changed props to extend from HTMLMotionProps<'button'> to match framer-motion's expected props and resolve type conflicts.
interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', isLoading = false, className, ...props }, ref) => {
    const baseClasses = "w-full h-12 rounded-xl text-md font-bold flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background)]";

    const variantClasses = variant === 'primary'
      ? "bg-gradient-to-r from-[var(--color-primary-accent)] to-[var(--color-secondary-accent)] text-black hover:scale-105 focus:ring-[var(--color-secondary-accent)]"
      : "bg-white/10 text-white hover:bg-white/20 focus:ring-white";

    return (
      <MotionButton
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${baseClasses} ${variantClasses} ${className} ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? <LoadingSpinner size="sm" /> : children}
      </MotionButton>
    );
  }
);