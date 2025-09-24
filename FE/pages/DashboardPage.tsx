

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { GradientText, LoadingSpinner } from '../components/ui';
import { BalanceOverview, DashboardExpenseTable, SplitDistributionChart } from '../components/Dashboard';
import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

// FIX: Alias motion components to local variables to help TypeScript with type inference.
const MotionDiv = motion.div;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', user?.id],
    // FIX: Unwrapped the data from the API response to match the expected type for `useQuery`.
    queryFn: () => getDashboardData(user!.id).then(res => res.data),
    enabled: !!user,
  });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Failed to load dashboard data.</div>;
  }

  return (
    <MotionDiv 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <MotionDiv variants={itemVariants}>
        <h1 className="text-4xl font-bold font-[var(--font-heading)]">
          Welcome back, <GradientText>{user?.name}</GradientText>
        </h1>
        <p className="text-gray-400 mt-1">Here's your financial overview.</p>
      </MotionDiv>

      {data?.fraudAlerts && data.fraudAlerts.length > 0 && (
         <MotionDiv variants={itemVariants} className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg flex items-center gap-4">
             <FiAlertTriangle className="text-2xl text-red-400" />
             <p className="font-medium text-red-300">You have {data.fraudAlerts.length} new fraud alerts to review.</p>
         </MotionDiv>
      )}

      <MotionDiv variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BalanceOverview data={data} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2">
            <SplitDistributionChart data={data} isLoading={isLoading} />
        </div>
      </MotionDiv>

      <MotionDiv variants={itemVariants}>
         <h2 className="text-2xl font-bold font-[var(--font-heading)]">Recent Expenses</h2>
         <DashboardExpenseTable expenses={data?.expenses} isLoading={isLoading} user={user} />
      </MotionDiv>
    </MotionDiv>
  );
};

export default DashboardPage;