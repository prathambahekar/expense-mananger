
import React from 'react';
import type { DashboardData, Expense, User } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { GradientText, SkeletonLoader } from './ui';
import { FiTrendingUp, FiTrendingDown, FiMoreVertical } from 'react-icons/fi';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// --- Balance Overview ---
export const BalanceOverview: React.FC<{ data?: DashboardData; isLoading: boolean }> = ({ data, isLoading }) => {
    if (isLoading) {
        return <SkeletonLoader className="h-40 w-full" />;
    }

    const netBalance = data?.balances.reduce((acc, b) => acc + b.net, 0) || 0;
    const isPositive = netBalance >= 0;

    return (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Net Balance</h3>
            <div className={`flex items-center gap-2 text-4xl font-bold font-[var(--font-heading)] ${isPositive ? 'text-[var(--color-primary-accent)]' : 'text-[var(--color-danger)]'}`}>
                {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                <span>{formatCurrency(netBalance, 'USD')}</span>
            </div>
            <div className="mt-4 text-sm text-gray-400">
                Across {data?.balances.length || 0} groups
            </div>
        </div>
    );
};

// --- Expense Table ---
export const DashboardExpenseTable: React.FC<{ expenses?: Expense[]; isLoading: boolean; user: User | null }> = ({ expenses, isLoading, user }) => {
    if (isLoading) {
        return (
            <div className="space-y-2 mt-6">
                {[...Array(5)].map((_, i) => <SkeletonLoader key={i} className="h-14 w-full" />)}
            </div>
        );
    }

    if (!expenses || expenses.length === 0) {
        return (
            <div className="mt-6 text-center py-10 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-gray-400">No recent expenses. Time to add one!</p>
            </div>
        );
    }

    return (
        <div className="mt-6 bg-white/5 p-2 rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-xs text-gray-400 uppercase">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Description</th>
                            <th className="p-4 text-right">Amount</th>
                            <th className="p-4">Payer</th>
                            <th className="p-4 text-right">Your Share</th>
                            <th className="p-4 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(expense => (
                            <tr key={expense.id} className="border-t border-white/10 hover:bg-white/5">
                                <td className="p-4 whitespace-nowrap">{formatDate(expense.date)}</td>
                                <td className="p-4 font-medium">{expense.description}</td>
                                <td className="p-4 text-right font-mono">{formatCurrency(expense.amount, expense.currency)}</td>
                                <td className="p-4">{expense.payer.name}</td>
                                <td className="p-4 text-right font-mono text-red-400">{formatCurrency(expense.shares?.find(s => s.userId === user?.id)?.share || 0, expense.currency)}</td>
                                <td className="p-4 text-center">
                                    <button className="text-gray-400 hover:text-white"><FiMoreVertical /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- Split Distribution Chart ---
export const SplitDistributionChart: React.FC<{ data?: DashboardData; isLoading: boolean }> = ({ data, isLoading }) => {
    if (isLoading) {
        return <SkeletonLoader className="h-64 w-full" />;
    }

    const chartData = {
        labels: ['Food', 'Travel', 'Entertainment', 'Utilities', 'Other'],
        datasets: [{
            data: [300, 150, 100, 80, 50], // Dummy data
            backgroundColor: ['#00FFD5', '#9B6CFF', '#3B82F6', '#F472B6', '#FBBF24'],
            borderColor: '#051027',
            borderWidth: 4,
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: '#a0aec0',
                    font: {
                        family: "'Inter', sans-serif"
                    }
                }
            },
            tooltip: {
                 callbacks: {
                    label: function(context: any) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
                        }
                        return label;
                    }
                }
            }
        },
        cutout: '60%',
    };

    return (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-64 relative">
             <h3 className="text-lg font-medium text-gray-300 mb-2">Expense Categories</h3>
            <Doughnut data={chartData} options={options} />
        </div>
    );
};
