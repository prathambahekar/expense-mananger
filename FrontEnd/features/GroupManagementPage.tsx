import React, { useState, useMemo } from 'react';
import FeaturePageLayout from './FeaturePageLayout';
import { GroupIcon, TrashIcon, PlusIcon } from '../assets/icons';
import Card from '../components/Card';
import { motion } from 'framer-motion';
import { useCurrency } from '../context/CurrencyContext';

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

const initialDummyGroups = [
  { 
    name: 'Europe Trip', 
    totalSpent: 1200, 
    members: [
        { name: 'Alex', amount: 500 },
        { name: 'Jess', amount: 400 },
        { name: 'You', amount: 300 }
    ]
  },
  { 
    name: 'Apartment 4B', 
    totalSpent: 850, 
    members: [
        { name: 'Sam', amount: 425 },
        { name: 'Kate', amount: 225 },
        { name: 'You', amount: 200 }
    ]
  },
  { 
    name: 'Project Phoenix', 
    totalSpent: 450, 
    members: [
        { name: 'Peter', amount: 225 },
        { name: 'You', amount: 225 }
    ]
  },
];

const GroupManagementPage: React.FC = () => {
    const { formatCurrency, currencySymbol, convertToUsd } = useCurrency();
    const [groups, setGroups] = useState(initialDummyGroups);
    
    // Form state
    const [groupName, setGroupName] = useState('');
    const [totalExpense, setTotalExpense] = useState('');
    const [members, setMembers] = useState([{ name: '', amount: '' }]);

    const handleMemberChange = (index: number, field: 'name' | 'amount', value: string) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    const addMember = () => {
        setMembers([...members, { name: '', amount: '' }]);
    };

    const removeMember = (index: number) => {
        const newMembers = members.filter((_, i) => i !== index);
        setMembers(newMembers);
    };
    
    const { currentSum, remaining, isOverBudget } = useMemo(() => {
        const total = parseFloat(totalExpense) || 0;
        const sum = members.reduce((acc, member) => acc + (parseFloat(member.amount) || 0), 0);
        return {
            currentSum: sum,
            remaining: total - sum,
            isOverBudget: sum > total && total > 0,
        };
    }, [members, totalExpense]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isOverBudget || !groupName || !totalExpense || members.some(m => !m.name || !m.amount)) return;
        
        const newGroup = {
            name: groupName,
            totalSpent: convertToUsd(parseFloat(totalExpense)),
            members: members.map(m => ({ name: m.name, amount: convertToUsd(parseFloat(m.amount)) })),
        };
        
        setGroups(prevGroups => [newGroup, ...prevGroups]);
        
        // Reset form
        setGroupName('');
        setTotalExpense('');
        setMembers([{ name: '', amount: '' }]);
    };

  return (
    <FeaturePageLayout
      title="Group Management"
      description="Create groups for trips, roommates, or projects. Keep all related expenses organized in one place."
      Icon={GroupIcon}
    >
      <motion.div 
        className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 snap-x snap-mandatory"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex-shrink-0 w-full max-w-md snap-start">
            <Card className="h-full">
                <h2 className="text-2xl font-semibold mb-4">Create New Group</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="groupName" className="block text-sm font-medium text-text-secondary mb-1">Group Name</label>
                        <input type="text" id="groupName" value={groupName} onChange={e => setGroupName(e.target.value)} required className="w-full px-3 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-gray-600 rounded-md" placeholder="e.g., Road Trip"/>
                    </div>
                    <div>
                        <label htmlFor="totalExpense" className="block text-sm font-medium text-text-secondary mb-1">Total Expense ({currencySymbol})</label>
                        <input type="number" id="totalExpense" value={totalExpense} onChange={e => setTotalExpense(e.target.value)} required className="w-full px-3 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-gray-600 rounded-md" placeholder="e.g., 1000"/>
                    </div>
                    
                    <div className="space-y-2">
                         <label className="block text-sm font-medium text-text-secondary">Members' Contributions</label>
                        {members.map((member, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" value={member.name} onChange={e => handleMemberChange(index, 'name', e.target.value)} required className="w-1/2 px-3 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-gray-600 rounded-md" placeholder="Member Name"/>
                                <input type="number" value={member.amount} onChange={e => handleMemberChange(index, 'amount', e.target.value)} required className="w-1/2 px-3 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-gray-600 rounded-md" placeholder="Amount"/>
                                <button type="button" onClick={() => removeMember(index)} className="text-text-secondary hover:text-accent-red p-1 rounded-full">
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addMember} className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline">
                            <PlusIcon className="w-4 h-4" /> Add Member
                        </button>
                    </div>

                    <div className="text-sm space-y-1 pt-2">
                        <div className="flex justify-between"><span>Current Sum:</span> <span>{currencySymbol}{currentSum.toFixed(2)}</span></div>
                        <div className={`flex justify-between ${isOverBudget ? 'text-accent-red font-bold' : ''}`}><span>Remaining:</span> <span>{currencySymbol}{remaining.toFixed(2)}</span></div>
                        {isOverBudget && <p className="text-accent-red text-xs pt-1">The sum of contributions cannot exceed the total expense.</p>}
                    </div>

                    <button type="submit" disabled={isOverBudget} className="w-full px-4 py-2.5 bg-brand-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                        Create Group
                    </button>
                </form>
            </Card>
        </motion.div>

        {groups.map((group, index) => (
          <motion.div key={index} variants={itemVariants} className="flex-shrink-0 w-80 sm:w-96 snap-start">
            <Card className="h-full flex flex-col">
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                <p className="text-sm text-text-secondary mb-4">Total Spent: <span className="font-semibold text-text-primary dark:text-white">{formatCurrency(group.totalSpent)}</span></p>
                
                <h4 className="text-sm font-semibold mb-2 text-text-secondary">Contribution Breakdown</h4>
                <div className="space-y-2 overflow-y-auto pr-2">
                  {group.members.map(member => (
                    <div key={member.name} className="text-sm">
                        <div className="flex justify-between items-center mb-1">
                            <span>{member.name}</span>
                            <span className="font-semibold">{formatCurrency(member.amount)}</span>
                        </div>
                        <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2">
                            <div 
                                className="bg-brand-primary h-2 rounded-full"
                                style={{ width: `${(member.amount / group.totalSpent) * 100}%` }}
                            ></div>
                        </div>
                         <p className="text-right text-xs text-text-secondary mt-0.5">
                            {((member.amount / group.totalSpent) * 100).toFixed(1)}%
                        </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-light-border dark:border-white/10">
                <button className="w-full text-center font-semibold text-brand-primary hover:underline">
                  View Details
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </FeaturePageLayout>
  );
};

export default GroupManagementPage;