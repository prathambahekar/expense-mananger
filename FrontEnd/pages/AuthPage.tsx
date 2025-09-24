import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { EyeIcon, EyeSlashIcon } from '../assets/icons';

const inputStyles = "appearance-none relative block w-full px-3 py-3 border dark:border-gray-600 border-light-border dark:bg-transparent bg-light-card placeholder-gray-400 dark:placeholder-gray-500 text-text-primary dark:text-white rounded-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === 'admin' && password === 'password') {
      login();
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use admin / password to log in.');
    }
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-text-primary dark:text-dark-text">Welcome Back</h2>
        <p className="mt-2 text-text-secondary">Login to continue your cosmic journey.</p>
        <p className="mt-4 text-xs text-text-secondary">
          (Use <span className="font-semibold text-brand-primary">admin</span> and <span className="font-semibold text-brand-primary">password</span> to log in)
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-3">
            <input id="email-address" name="email" type="text" required className={inputStyles} placeholder="Username (admin)" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="relative">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} required className={inputStyles} placeholder="Password (password)" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary hover:text-text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
        </div>
        {error && <p className="text-accent-red text-sm text-center">{error}</p>}
        <div>
          <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
            Log In
          </button>
        </div>
      </form>
    </>
  );
}

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (name && email && password) {
        login();
        navigate('/dashboard');
      } else {
        setError('Please fill in all fields.');
      }
    };
    return (
        <>
            <div className="text-center">
                <h2 className="text-3xl font-bold text-text-primary dark:text-dark-text">Create Your Account</h2>
                <p className="mt-2 text-text-secondary">Embark on your journey with CosmicSplit.</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="rounded-md shadow-sm space-y-3">
                <input name="name" type="text" required className={inputStyles} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
                <input name="email" type="email" required className={inputStyles} placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
                <div className="relative">
                  <input name="password" type={showPassword ? 'text' : 'password'} required className={inputStyles} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                   <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary hover:text-text-primary"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                      {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                <div className="relative">
                  <input name="confirm-password" type={showConfirmPassword ? 'text' : 'password'} required className={inputStyles} placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                   <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary hover:text-text-primary"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                      {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                </div>
                {error && <p className="text-accent-red text-sm">{error}</p>}
                <div>
                <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
                    Register
                </button>
                </div>
            </form>
        </>
    );
}

const formVariants = {
    initial: { opacity: 0, y: 30, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -30, scale: 0.98 },
}

const TABS = [{ id: 'login', label: 'Login' }, { id: 'register', label: 'Register' }];

const AuthPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [formType, setFormType] = useState<'login' | 'register'>('login');

    useEffect(() => {
        setFormType(location.pathname === '/register' ? 'register' : 'login');
    }, [location]);

    useEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, []);

    const handleToggle = (type: 'login' | 'register') => {
        if (formType !== type) {
            navigate(`/${type}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-4 pt-24 pb-12">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6"
            >
                <Card className="p-1 flex gap-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleToggle(tab.id as 'login' | 'register')}
                            className={`relative w-32 py-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary`}
                        >
                            {formType === tab.id && (
                                <motion.div
                                    layoutId="active-auth-tab"
                                    className="absolute inset-0 bg-brand-primary rounded-lg"
                                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                />
                            )}
                            <span className={`relative z-10 transition-colors ${formType === tab.id ? 'text-white' : 'text-text-secondary hover:text-text-primary'}`}>
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="p-8 sm:p-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={formType}
                            variants={formVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                            className="w-full"
                        >
                            {formType === 'login' ? <LoginForm /> : <RegisterForm />}
                        </motion.div>
                    </AnimatePresence>
                </Card>
            </motion.div>
        </div>
    );
};

export default AuthPage;