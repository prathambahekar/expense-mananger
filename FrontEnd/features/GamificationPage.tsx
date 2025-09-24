import React from 'react';
import FeaturePageLayout from './FeaturePageLayout';
import { GamifyIcon } from '../assets/icons';
import Card from '../components/Card';
import { motion } from 'framer-motion';
import Tooltip from '../components/Tooltip';

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

const allBadges = [
    { emoji: '💰', name: 'First Expense', description: 'Log your very first expense.', achieved: true },
    { emoji: '🤝', name: 'First Group', description: 'Create or join your first group.', achieved: true },
    { emoji: '💸', name: 'First Settlement', description: 'Settle a debt for the first time.', achieved: true },
    { emoji: '✈️', name: 'Traveler', description: 'Log an expense in a different country.', achieved: false },
    { emoji: '🧠', name: 'AI Explorer', description: 'Use an AI-powered feature.', achieved: false },
    { emoji: '📈', name: 'Analyst', description: 'Check the reports page 5 times.', achieved: true },
    { emoji: '🏆', name: 'Debt Destroyer', description: 'Settle a debt over $100.', achieved: false },
    { emoji: '🦋', name: 'Social Butterfly', description: 'Be a member of 3+ groups.', achieved: true },
    { emoji: '🏦', name: 'Super Saver', description: 'Have a net positive balance for a month.', achieved: false },
    { emoji: '🎯', name: 'Budget Master', description: 'Stay under a group budget for a trip.', achieved: false },
    { emoji: '🔗', name: 'Integrator', description: 'Connect a payment integration.', achieved: true },
    { emoji: '🧾', name: 'Receipt Collector', description: 'Upload 10 receipts.', achieved: false },
];

const leaderboardData = [
    { name: 'Alex Rider', avatar: 'https://picsum.photos/seed/alex/100/100', score: 2500 },
    { name: 'Sam Winchester', avatar: 'https://picsum.photos/seed/sam/100/100', score: 2350 },
    { name: 'Jess Day', avatar: 'https://picsum.photos/seed/jess/100/100', score: 2100 },
    { name: 'Cosmic User', avatar: 'https://picsum.photos/seed/you/100/100', score: 1800 },
    { name: 'Kate Beckett', avatar: 'https://picsum.photos/seed/kate/100/100', score: 1550 },
    { name: 'Peter Parker', avatar: 'https://picsum.photos/seed/peter/100/100', score: 1200 },
].sort((a, b) => b.score - a.score);


const GamificationPage: React.FC = () => {
  return (
    <FeaturePageLayout
      title="Gamification"
      description="Earn badges for financial milestones and compete with friends on leaderboards. Making finance fun!"
      Icon={GamifyIcon}
    >
        <motion.div 
          className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 snap-x snap-mandatory"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
            <motion.div variants={itemVariants} className="flex-shrink-0 w-full max-w-2xl snap-start">
                <Card>
                    <h2 className="text-2xl font-semibold mb-6">Your Badge Collection</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {allBadges.map((badge, index) => (
                            <Tooltip key={index} content={badge.description}>
                                <div 
                                    className={`text-center p-4 bg-black/5 dark:bg-white/10 rounded-lg transition-opacity duration-300 ${!badge.achieved && 'opacity-40'}`}
                                >
                                    <span className="text-5xl">{badge.emoji}</span>
                                    <p className="text-sm font-semibold mt-2">{badge.name}</p>
                                    <p className="text-xs text-text-secondary hidden sm:block">{badge.description}</p>
                                </div>
                            </Tooltip>
                        ))}
                    </div>
                </Card>
            </motion.div>
            <motion.div variants={itemVariants} className="flex-shrink-0 w-full max-w-md snap-start">
                <Card>
                    <h2 className="text-2xl font-semibold mb-6">Leaderboard</h2>
                    <div className="space-y-3">
                        {leaderboardData.map((user, index) => {
                            const rank = index + 1;
                            let rankStyles = '';
                            let rankText = '';
                            if (rank === 1) { rankStyles = 'bg-amber-400/20'; rankText = 'text-amber-400'; }
                            else if (rank === 2) { rankStyles = 'bg-gray-400/20'; rankText = 'text-gray-400'; }
                            else if (rank === 3) { rankStyles = 'bg-orange-600/20'; rankText = 'text-orange-500'; }

                            const isCurrentUser = user.name === 'Cosmic User';

                            return (
                                <div key={user.name} className={`flex items-center gap-4 p-2 rounded-lg transition-all ${rankStyles} ${isCurrentUser ? 'border-2 border-brand-primary' : ''}`}>
                                    <span className={`font-bold w-6 text-center text-lg ${rankText}`}>{rank}</span>
                                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                    <p className={`font-medium ${isCurrentUser ? 'font-bold' : ''}`}>{user.name}</p>
                                    <p className="ml-auto font-bold">{user.score.toLocaleString()} pts</p>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    </FeaturePageLayout>
  );
};

export default GamificationPage;