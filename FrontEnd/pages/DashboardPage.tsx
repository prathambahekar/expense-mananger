import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import Card from '../components/Card';
import { useCurrency } from '../context/CurrencyContext';
import { CURRENCIES } from '../constants';
import {
  WalletIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  ScaleIcon,
  PlusCircleIcon,
  GroupIcon,
  ChevronDownSolidIcon,
} from '../assets/icons';
import { useTheme } from '../hooks/useTheme';
import CustomChartTooltip from '../components/CustomChartTooltip';


// Dummy data for the dashboard
const dashboardData = {
  totalBalance: 155.50, // USD
  youOwe: 75.25, // USD
  youAreOwed: 230.75, // USD
  recentActivity: [
    { id: 1, type: 'expense', description: 'Team Lunch at Orbit Diner', amount: 75.50, group: 'Project Phoenix' },
    { id: 2, type: 'payment_received', description: 'Jess paid you for groceries', amount: 35.00, group: 'Apartment 4B' },
    { id: 3, type: 'payment_sent', description: 'You paid Alex for movie tickets', amount: 25.00, group: 'Europe Trip' },
    { id: 4, type: 'expense', description: 'Hyperloop ticket', amount: 45.00, group: 'Business Travel' },
    { id: 5, type: 'payment_received', description: 'Peter sent his share for pizza', amount: 12.50, group: 'Weekend Hangout' },
  ],
};

const areaChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
];

const pieData = [
  { name: 'Food', value: 400 },
  { name: 'Transport', value: 300 },
  { name: 'Housing', value: 800 },
  { name: 'Entertainment', value: 200 },
];

const lightChartColors = ['#4f46e5', '#a5b4fc', '#6b7280', '#d1d5db'];
const darkChartColors = ['#818cf8', '#4f46e5', '#9ca3af', '#4b5563'];


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

const DashboardPage: React.FC = () => {
  const { currency, setCurrency, formatCurrency } = useCurrency();
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const chartColors = theme === 'light' ? lightChartColors : darkChartColors;
  const totalSpentInBreakdown = pieData.reduce((sum, entry) => sum + entry.value, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Welcome, Cosmic User!</h1>
          <p className="text-text-secondary mt-1">Here's your financial universe at a glance.</p>
        </div>
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsCurrencyOpen(prev => !prev)}
                className="flex items-center gap-2 px-4 py-2 bg-light-card dark:bg-white/10 border border-light-border dark:border-white/20 rounded-lg shadow-sm w-full sm:w-auto justify-between"
            >
                <span className="font-semibold">{currency}</span>
                <motion.div animate={{ rotate: isCurrencyOpen ? 180 : 0 }}>
                    <ChevronDownSolidIcon className="w-5 h-5 text-text-secondary" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isCurrencyOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 mt-1 w-full sm:w-48 bg-light-card dark:bg-dark-bg border border-light-border dark:border-white/20 rounded-lg shadow-lg overflow-hidden"
                    >
                        {CURRENCIES.map(c => (
                            <li
                                key={c.code}
                                onClick={() => {
                                    setCurrency(c.code);
                                    setIsCurrencyOpen(false);
                                }}
                                className="px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                            >
                                {c.code} - <span className="text-text-secondary">{c.name}</span>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Column 1: Overview */}
        <motion.div variants={itemVariants} className="flex-shrink-0 w-80 space-y-6">
            <h2 className="text-xl font-bold px-2">Overview</h2>
            <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-primary/10 rounded-lg"><WalletIcon className="w-8 h-8 text-brand-primary" /></div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-secondary">Total Balance</h2>
                    <p className="text-3xl font-bold">{formatCurrency(dashboardData.totalBalance)}</p>
                  </div>
                </div>
            </Card>
            <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent-red/10 rounded-lg"><ArrowUpCircleIcon className="w-8 h-8 text-accent-red" /></div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-secondary">You Owe</h2>
                    <p className="text-3xl font-bold">{formatCurrency(dashboardData.youOwe)}</p>
                  </div>
                </div>
            </Card>
            <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent-green/10 rounded-lg"><ArrowDownCircleIcon className="w-8 h-8 text-accent-green" /></div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-secondary">You Are Owed</h2>
                    <p className="text-3xl font-bold">{formatCurrency(dashboardData.youAreOwed)}</p>
                  </div>
                </div>
            </Card>
        </motion.div>
        
        {/* Column 2: Visual Reports */}
        <motion.div variants={itemVariants} className="flex-shrink-0 w-[500px] space-y-6">
            <h2 className="text-xl font-bold px-2">Visual Reports</h2>
            <Card>
                <h2 className="text-xl font-semibold mb-2">Spending Trend</h2>
                <p className="text-text-secondary mb-4 text-sm">Your total spending over the last 6 months.</p>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <AreaChart data={areaChartData}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColors[0]} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={chartColors[0]} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke={theme === 'light' ? '#6c757d' : '#9ca3af'} fontSize={12} />
                            <YAxis stroke={theme === 'light' ? '#6c757d' : '#9ca3af'} fontSize={12}/>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <Tooltip content={<CustomChartTooltip />}/>
                            <Area type="monotone" dataKey="value" stroke={chartColors[0]} fillOpacity={1} fill="url(#colorUv)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            <Card className="relative">
                <h3 className="text-xl font-semibold text-center">Spending Breakdown</h3>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10px] text-center pointer-events-none">
                    <p className="text-xs text-text-secondary">Total</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalSpentInBreakdown)}</p>
                </div>
                <div style={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" paddingAngle={5}>
                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />)}
                            </Pie>
                            <Tooltip content={<CustomChartTooltip />} />
                            <Legend wrapperStyle={{fontSize: "12px"}} iconSize={10} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </motion.div>

        {/* Column 3: Recent Activity */}
        <motion.div variants={itemVariants} className="flex-shrink-0 w-96">
            <h2 className="text-xl font-bold px-2 mb-6">Recent Activity</h2>
            <Card className="max-h-[calc(100vh-220px)] overflow-y-auto">
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between gap-4 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {activity.type === 'expense' && <ScaleIcon className="w-6 h-6 text-text-secondary" />}
                          {activity.type === 'payment_received' && <ArrowDownCircleIcon className="w-6 h-6 text-accent-green" />}
                          {activity.type === 'payment_sent' && <ArrowUpCircleIcon className="w-6 h-6 text-accent-red" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{activity.description}</p>
                          <p className="text-xs text-text-secondary">{activity.group}</p>
                        </div>
                      </div>
                      <p className={`font-bold text-base whitespace-nowrap ${activity.type === 'payment_sent' ? 'text-accent-red' : ''} ${activity.type === 'payment_received' ? 'text-accent-green' : ''}`}>
                        {activity.type === 'payment_sent' ? '-' : ''}
                        {activity.type === 'payment_received' ? '+' : ''}
                        {formatCurrency(activity.amount)}
                      </p>
                    </div>
                  ))}
                </div>
            </Card>
        </motion.div>
        
        {/* Column 4: Quick Actions */}
        <motion.div variants={itemVariants} className="flex-shrink-0 w-80">
            <h2 className="text-xl font-bold px-2 mb-6">Quick Actions</h2>
            <Card>
                <div className="space-y-3">
                  <NavLink to="/features/expenses" className="flex items-center gap-3 p-3 w-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-lg transition-colors">
                    <PlusCircleIcon className="w-6 h-6 text-brand-primary" />
                    <span className="font-semibold">Log a New Expense</span>
                  </NavLink>
                  <NavLink to="/features/groups" className="flex items-center gap-3 p-3 w-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-lg transition-colors">
                    <GroupIcon className="w-6 h-6 text-brand-primary" />
                    <span className="font-semibold">Manage Groups</span>
                  </NavLink>
                  <NavLink to="/features/settlements" className="flex items-center gap-3 p-3 w-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-lg transition-colors">
                    <ScaleIcon className="w-6 h-6 text-brand-primary" />
                    <span className="font-semibold">Settle Up Debts</span>
                  </NavLink>
                </div>
            </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;