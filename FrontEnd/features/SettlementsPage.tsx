
import React from 'react';
import FeaturePageLayout from './FeaturePageLayout';
import { SettleIcon } from '../assets/icons';
import Card from '../components/Card';
import { motion } from 'framer-motion';

// New, more detailed dummy data for settlements
const dummySettlements = [
  {
    person: 'Alex Rider',
    avatar: 'https://picsum.photos/seed/alex/100/100',
    netAmount: 55.20,
    type: 'owe',
    transactions: [
      { description: 'Movie Tickets', amount: 25.00 },
      { description: 'Dinner at Galaxy Grill', amount: 30.20 },
    ]
  },
  {
    person: 'Jess Day',
    avatar: 'https://picsum.photos/seed/jess/100/100',
    netAmount: -25.00,
    type: 'owed',
    transactions: [
      { description: 'Your share of Groceries', amount: 15.00 },
      { description: 'Your share of Coffee run', amount: 10.00 },
    ]
  },
  {
    person: 'Sam Winchester',
    avatar: 'https://picsum.photos/seed/sam/100/100',
    netAmount: 15.75,
    type: 'owe',
    transactions: [
        { description: 'Concert Tickets', amount: 40.00 },
        { description: 'Gas (credit from Sam)', amount: -24.25 },
    ]
  },
  {
    person: 'Kate Beckett',
    avatar: 'https://picsum.photos/seed/kate/100/100',
    netAmount: -75.00,
    type: 'owed',
    transactions: [
        { description: 'Your share of Hotel', amount: 75.00 },
    ]
  },
  {
    person: 'Peter Parker',
    avatar: 'https://picsum.photos/seed/peter/100/100',
    netAmount: 5.50,
    type: 'owe',
    transactions: [
        { description: 'Pizza night', amount: 5.50 },
    ]
  }
];

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


const SettlementsPage: React.FC = () => {
    // Overall balance = sum of what you are owed (positive) - sum of what you owe (negative)
    // Owed (netAmount < 0), Owe (netAmount > 0)
    // Balance = sum of (-netAmount)
    const totalNetBalance = dummySettlements.reduce((acc, curr) => acc - curr.netAmount, 0);

  return (
    <FeaturePageLayout
      title="Smart Settlements"
      description="Settle up with a single tap. We calculate who owes whom, simplifying complex debts into easy payments."
      Icon={SettleIcon}
    >
      <div className="mb-8">
        <Card>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h2 className="text-xl font-semibold">Overall Net Balance</h2>
                    <p className="text-sm text-text-secondary">Your total financial position across all contacts.</p>
                </div>
                <p className={`text-3xl font-bold ${totalNetBalance >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                    {totalNetBalance >= 0 ? '+' : '-'}${Math.abs(totalNetBalance).toFixed(2)}
                </p>
            </div>
        </Card>
      </div>

      <motion.div 
        className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 snap-x snap-mandatory"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {dummySettlements.map((settlement, index) => (
          <motion.div key={index} variants={itemVariants} className="flex-shrink-0 w-80 sm:w-96 snap-start">
            <Card className="h-full flex flex-col p-5">
              <div className="flex items-center gap-4 mb-4">
                <img src={settlement.avatar} alt={settlement.person} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" />
                <div>
                  <h3 className="text-lg font-bold">{settlement.person}</h3>
                  <p className={`text-sm font-medium ${settlement.type === 'owe' ? 'text-accent-red' : 'text-accent-green'}`}>
                    {settlement.type === 'owe' ? 'You Owe' : 'Owes You'}
                  </p>
                </div>
              </div>

              <div className="text-center my-4">
                <p className="text-sm text-text-secondary">Net Balance</p>
                <p className={`text-4xl font-bold ${settlement.type === 'owe' ? 'text-accent-red' : 'text-accent-green'}`}>
                  ${Math.abs(settlement.netAmount).toFixed(2)}
                </p>
              </div>
              
              <div className="flex-grow border-t border-light-border dark:border-white/10 pt-4">
                <h4 className="text-sm font-semibold mb-2 text-text-secondary">Transaction Breakdown</h4>
                <div className="space-y-2 text-sm max-h-32 overflow-y-auto pr-2">
                  {settlement.transactions.map((tx, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-text-secondary truncate pr-2">{tx.description}</span>
                      <span className={`font-medium whitespace-nowrap ${tx.amount < 0 ? 'text-accent-green' : 'text-text-primary dark:text-dark-text'}`}>
                        {tx.amount < 0 ? '-' : ''} ${Math.abs(tx.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full px-4 py-2.5 bg-brand-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
                  Settle Up with {settlement.person.split(' ')[0]}
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </FeaturePageLayout>
  );
};

export default SettlementsPage;