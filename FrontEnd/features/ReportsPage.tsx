
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import FeaturePageLayout from './FeaturePageLayout';
import { ReportIcon, DownloadIcon } from '../assets/icons';
import Card from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';
import CustomChartTooltip from '../components/CustomChartTooltip';

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

// --- Placeholder Component for Loading State ---
const ChartPlaceholder: React.FC<{ className?: string }> = ({ className }) => (
     <Card className={className}>
        <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
     </Card>
);


// --- Data Definitions ---

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

const monthlyComparisonData = {
    currentMonth: 1700,
    previousMonth: 1450,
};

const topCategoriesData = [
    { name: 'Housing', value: 800 },
    { name: 'Food', value: 400 },
    { name: 'Transport', value: 300 },
    { name: 'Shopping', value: 150 },
];

const groupSpendingData = [
    { name: 'Europe Trip', value: 1200 },
    { name: 'Apartment 4B', value: 850 },
    { name: 'Project Phoenix', value: 450 },
];

const lightChartColors = ['#4f46e5', '#a5b4fc', '#6b7280', '#d1d5db'];
const darkChartColors = ['#818cf8', '#4f46e5', '#9ca3af', '#4b5563'];


const ReportsPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { theme } = useTheme();
    const chartColors = theme === 'light' ? lightChartColors : darkChartColors;
    const totalSpentInBreakdown = pieData.reduce((sum, entry) => sum + entry.value, 0);
    const percentageChange = ((monthlyComparisonData.currentMonth - monthlyComparisonData.previousMonth) / monthlyComparisonData.previousMonth) * 100;

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

  return (
    <FeaturePageLayout
      title="Reports & Analytics"
      description="Visualize your spending habits with beautiful charts. Understand where your money goes and budget smarter."
      Icon={ReportIcon}
    >
        {isLoading ? (
            <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 snap-x snap-mandatory">
                <div className="flex-shrink-0 w-80 sm:w-96 snap-start">
                    <ChartPlaceholder className="h-[218px]" />
                </div>
                <div className="flex-shrink-0 w-full max-w-xl snap-start">
                    <ChartPlaceholder className="h-[398px]" />
                </div>
                <div className="flex-shrink-0 w-80 sm:w-96 snap-start">
                    <ChartPlaceholder className="h-[418px]" />
                </div>
                <div className="flex-shrink-0 w-full max-w-lg snap-start">
                    <ChartPlaceholder className="h-[374px]" />
                </div>
            </div>
        ) : (
            <motion.div 
                className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 snap-x snap-mandatory"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="flex-shrink-0 w-80 sm:w-96 snap-start">
                    <Card className="h-full">
                        <h2 className="text-xl font-semibold mb-2">Monthly Comparison</h2>
                        <p className="text-sm text-text-secondary mb-4">This month's spending vs. last month.</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-baseline">
                                <span className="font-medium text-text-secondary">This Month</span>
                                <span className="font-bold text-2xl">${monthlyComparisonData.currentMonth.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="font-medium text-text-secondary">Last Month</span>
                                <span className="font-bold text-lg text-text-secondary">${monthlyComparisonData.previousMonth.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className={`mt-4 text-center p-2 rounded-lg ${percentageChange >= 0 ? 'bg-accent-red/10 text-accent-red' : 'bg-accent-green/10 text-accent-green'}`}>
                            <span className="font-semibold">{percentageChange >= 0 ? '▲' : '▼'} {Math.abs(percentageChange).toFixed(1)}%</span> from last month
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="flex-shrink-0 w-full max-w-xl snap-start">
                    <Card>
                        <h2 className="text-2xl font-semibold mb-2">Spending Trend</h2>
                        <p className="text-text-secondary mb-6">Your total spending over the last 6 months.</p>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <AreaChart data={areaChartData}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={chartColors[0]} stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor={chartColors[0]} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke={theme === 'light' ? '#6c757d' : '#9ca3af'} />
                                    <YAxis stroke={theme === 'light' ? '#6c757d' : '#9ca3af'} />
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                    <Tooltip content={<CustomChartTooltip />}/>
                                    <Area type="monotone" dataKey="value" stroke={chartColors[0]} fillOpacity={1} fill="url(#colorUv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex-shrink-0 w-80 sm:w-96 snap-start">
                    <Card className="relative h-full">
                        <h3 className="text-xl font-semibold mb-4 text-center">Spending Breakdown</h3>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20px] text-center pointer-events-none">
                            <p className="text-xs text-text-secondary">Total</p>
                            <p className="text-2xl font-bold">${totalSpentInBreakdown.toLocaleString()}</p>
                        </div>
                        <div style={{ width: '100%', height: 320 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" paddingAngle={5}>
                                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />)}
                                    </Pie>
                                    <Tooltip content={<CustomChartTooltip />} />
                                    <Legend wrapperStyle={{paddingTop: "20px"}} iconSize={10} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="flex-shrink-0 w-full max-w-lg snap-start">
                    <Card>
                        <h2 className="text-2xl font-semibold mb-6">Top Spending Categories</h2>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={topCategoriesData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" stroke={theme === 'light' ? '#6c757d' : '#9ca3af'} width={80} tickLine={false} axisLine={false}/>
                                    <Tooltip content={<CustomChartTooltip />} cursor={{fill: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'}} />
                                     <Bar dataKey="value" name="Spent" radius={[0, 5, 5, 0]}>
                                        {topCategoriesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="flex-shrink-0 w-full max-w-lg snap-start">
                    <Card>
                        <h2 className="text-2xl font-semibold mb-6">Group Spending Breakdown</h2>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={groupSpendingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis dataKey="name" stroke={theme === 'light' ? '#6c757d' : '#9ca3af'} />
                                    <YAxis stroke={theme === 'light' ? '#6c757d' : '#9ca3af'} />
                                    <Tooltip content={<CustomChartTooltip />} cursor={{fill: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'}} />
                                    <Bar dataKey="value" name="Total Spent" radius={[5, 5, 0, 0]}>
                                       {groupSpendingData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="flex-shrink-0 w-80 sm:w-96 snap-start">
                    <Card className="h-full flex flex-col justify-center">
                        <h2 className="text-2xl font-semibold mb-4">Export Reports</h2>
                        <p className="text-text-secondary mb-6 flex-grow">Download your monthly summaries or transaction history as a CSV or PDF file.</p>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
                            <DownloadIcon />
                            Download Now
                        </button>
                    </Card>
                </motion.div>
            </motion.div>
        )}
    </FeaturePageLayout>
  );
};

export default ReportsPage;