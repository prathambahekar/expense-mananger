import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { ChevronDownSolidIcon } from '../assets/icons';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const SettingsPage: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [profile, setProfile] = useState({ name: 'Cosmic User', email: 'user@cosmicsplit.com' });
    const [notifications, setNotifications] = useState({ email: true, push: true, monthlyReports: false });
    const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    const handleNotificationChange = (name: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [name]: !prev[name] }));
    };
    
    const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void; }) => (
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                checked ? 'bg-brand-primary' : 'bg-gray-200 dark:bg-gray-600'
            }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-3xl sm:text-4xl font-bold">Settings</h1>
                <p className="text-text-secondary mt-1">Manage your account and preferences.</p>
            </motion.div>

            <motion.div 
                className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 snap-x snap-mandatory"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Profile Settings */}
                <motion.div variants={itemVariants} className="flex-shrink-0 w-full max-w-lg snap-start">
                    <Card>
                        <h2 className="text-2xl font-semibold mb-4 border-b border-light-border dark:border-white/10 pb-2">Profile</h2>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                                <input type="text" name="name" id="name" value={profile.name} onChange={handleProfileChange} className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                                <input type="email" name="email" id="email" value={profile.email} onChange={handleProfileChange} className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                            </div>
                            <div className="pt-2">
                                <button type="submit" onClick={(e) => e.preventDefault()} className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">Save Changes</button>
                            </div>
                        </form>
                    </Card>
                </motion.div>

                {/* Password & Security */}
                <motion.div variants={itemVariants} className="flex-shrink-0 w-full max-w-lg snap-start">
                    <Card>
                        <h2 className="text-2xl font-semibold mb-4 border-b border-light-border dark:border-white/10 pb-2">Password & Security</h2>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="current" className="block text-sm font-medium text-text-secondary mb-1">Current Password</label>
                                <input type="password" name="current" id="current" value={password.current} onChange={handlePasswordChange} className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                            </div>
                            <div>
                                <label htmlFor="new" className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
                                <input type="password" name="new" id="new" value={password.new} onChange={handlePasswordChange} className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                            </div>
                            <div className="pt-2">
                                <button type="submit" onClick={(e) => e.preventDefault()} className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">Update Password</button>
                            </div>
                        </form>
                    </Card>
                </motion.div>

                {/* Notification Settings */}
                <motion.div variants={itemVariants} className="flex-shrink-0 w-full max-w-md snap-start">
                    <Card>
                        <h2 className="text-2xl font-semibold mb-4 border-b border-light-border dark:border-white/10 pb-2">Notifications</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label htmlFor="email" className="font-medium">Email Notifications</label>
                                <Switch checked={notifications.email} onChange={() => handleNotificationChange('email')} />
                            </div>
                             <div className="flex items-center justify-between">
                                <label htmlFor="push" className="font-medium">Push Notifications</label>
                                <Switch checked={notifications.push} onChange={() => handleNotificationChange('push')} />
                            </div>
                             <div className="flex items-center justify-between">
                                <label htmlFor="monthlyReports" className="font-medium">Monthly Reports</label>
                                <Switch checked={notifications.monthlyReports} onChange={() => handleNotificationChange('monthlyReports')} />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Preferences */}
                <motion.div variants={itemVariants} className="flex-shrink-0 w-full max-w-md snap-start">
                    <Card>
                        <h2 className="text-2xl font-semibold mb-4 border-b border-light-border dark:border-white/10 pb-2">Preferences</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-text-secondary mb-1">Language</label>
                                <div className="relative">
                                    <select id="language" className="w-full appearance-none px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-gray-600 rounded-md pr-12 focus:outline-none focus:ring-1 focus:ring-brand-primary">
                                        <option>English</option>
                                        <option>Español</option>
                                        <option>Français</option>
                                        <option>Deutsch</option>
                                    </select>
                                    <ChevronDownSolidIcon className="w-6 h-6 text-text-secondary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                             <div>
                                <label htmlFor="theme" className="block text-sm font-medium text-text-secondary mb-1">Theme</label>
                                <div className="relative">
                                    <select id="theme" value={theme} onChange={toggleTheme} className="w-full appearance-none px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-gray-600 rounded-md pr-12 focus:outline-none focus:ring-1 focus:ring-brand-primary">
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                    <ChevronDownSolidIcon className="w-6 h-6 text-text-secondary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Privacy & Data */}
                 <motion.div variants={itemVariants} className="flex-shrink-0 w-full max-w-lg snap-start">
                    <Card>
                        <h2 className="text-2xl font-semibold mb-4 border-b border-light-border dark:border-white/10 pb-2">Privacy & Data</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold">Export Data</h3>
                                    <p className="text-sm text-text-secondary">Request an export of all your data.</p>
                                </div>
                                <button className="px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-semibold rounded-lg transition-colors flex-shrink-0">Request Export</button>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-accent-red">Delete Account</h3>
                                    <p className="text-sm text-text-secondary">Permanently delete your account and all associated data. This action is irreversible.</p>
                                </div>
                                <button className="px-4 py-2 bg-accent-red text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex-shrink-0">Delete Account</button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SettingsPage;