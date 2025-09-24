

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

import { loginSchema, registerSchema } from '../utils';
import { useAuth } from '../hooks/useAuth';
import { registerUser, loginUser } from '../services/api';
import { GradientText, Input, Button } from '../components/ui';

type Tab = 'login' | 'register';

// FIX: Alias motion components to local variables to help TypeScript with type inference.
const MotionForm = motion.form;

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('login');
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
  } = useForm({ resolver: yupResolver(registerSchema) });

  const onLogin = async (data: any) => {
    try {
      const response = await loginUser(data);
      setAuth(response.data);
      toast.success(`Welcome back, ${response.data.user.name}!`);
      navigate('/dashboard');
    } catch (error) {
      // Error toast is handled by axios interceptor
      console.error(error);
    }
  };

  const onRegister = async (data: any) => {
    try {
      const response = await registerUser(data);
      setAuth(response.data);
      toast.success(`Welcome, ${response.data.user.name}!`);
      navigate('/dashboard');
    } catch (error) {
       console.error(error);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#051027] p-4 cosmic-background">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        <div className="hidden md:flex flex-col justify-center p-12 bg-white/5">
          <img src="/logo.svg" alt="Logo" className="h-10 w-auto mb-6 self-start" />
          <h1 className="text-4xl font-bold font-[var(--font-heading)] leading-tight mb-4">
            Shared Expense Manager
          </h1>
          <p className="text-lg text-gray-300">
            <GradientText>AI-Powered</GradientText> Group Expense Splitting.
          </p>
        </div>
        <div className="bg-[#0b193d] p-8 md:p-12">
          <div className="flex border-b border-white/10 mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 pb-3 font-bold text-lg transition-colors ${activeTab === 'login' ? 'text-white border-b-2 border-[var(--color-primary-accent)]' : 'text-gray-500'}`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 pb-3 font-bold text-lg transition-colors ${activeTab === 'register' ? 'text-white border-b-2 border-[var(--color-primary-accent)]' : 'text-gray-500'}`}
            >
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              <MotionForm key="login" variants={formVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleLoginSubmit(onLogin)} className="space-y-6">
                <Input label="Email" register={registerLogin('email')} error={loginErrors.email?.message} type="email" placeholder="you@example.com" />
                <Input label="Password" register={registerLogin('password')} error={loginErrors.password?.message} type="password" placeholder="••••••••" />
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-300">
                        <input type="checkbox" className="rounded bg-white/10 border-white/20 text-[var(--color-secondary-accent)] focus:ring-[var(--color-secondary-accent)]" />
                        Remember me
                    </label>
                    <a href="#" className="font-medium text-[var(--color-secondary-accent)] hover:underline">Forgot password?</a>
                </div>
                <Button type="submit" isLoading={isLoginSubmitting}>Login</Button>
              </MotionForm>
            ) : (
              <MotionForm key="register" variants={formVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleRegisterSubmit(onRegister)} className="space-y-6">
                <Input label="Name" register={registerRegister('name')} error={registerErrors.name?.message} placeholder="Alice" />
                <Input label="Email" register={registerRegister('email')} error={registerErrors.email?.message} type="email" placeholder="alice@example.com" />
                <Input label="Password" register={registerRegister('password')} error={registerErrors.password?.message} type="password" placeholder="Minimum 8 characters" />
                <Input label="Confirm Password" register={registerRegister('confirmPassword')} error={registerErrors.confirmPassword?.message} type="password" placeholder="••••••••" />
                <Button type="submit" isLoading={isRegisterSubmitting}>Create Account</Button>
              </MotionForm>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;