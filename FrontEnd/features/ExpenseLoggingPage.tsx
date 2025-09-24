import React, { useState, useEffect, useRef } from 'react';
import FeaturePageLayout from './FeaturePageLayout';
import { ExpenseIcon, PlusIcon, MinusIcon, ChevronDownSolidIcon } from '../assets/icons';
import Card from '../components/Card';
import { motion, AnimatePresence } from 'framer-motion';

const dummyExpenses = [
    { id: 1, description: 'Team Lunch at Orbit Diner', amount: 75.50, category: 'Food & Dining', date: '2024-07-20' },
    { id: 2, description: 'Hyperloop ticket', amount: 45.00, category: 'Transport', date: '2024-07-19' },
    { id: 3, description: 'Groceries from Star Market', amount: 120.25, category: 'Groceries', date: '2024-07-18' },
];

const CATEGORIES = [
    'Food & Dining', 'Groceries', 'Transport', 'Housing', 'Utilities', 'Home', 'Pets', 'Kids', 
    'Health & Wellness', 'Shopping', 'Entertainment', 'Personal Care', 'Education', 'Travel', 
    'Business', 'Insurance', 'Taxes', 'Investments', 'Gifts & Donations', 'Subscriptions', 'Miscellaneous'
];

const ExpenseLoggingPage: React.FC = () => {
  const [expenses, setExpenses] = useState(dummyExpenses);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  
  // State for custom dropdown
  const [category, setCategory] = useState('Food & Dining');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Reset search and highlight when dropdown state changes
  useEffect(() => {
    if (isCategoryOpen) {
        setHighlightedIndex(filteredCategories.indexOf(category));
        setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
        setCategorySearch('');
    }
  }, [isCategoryOpen]);

  const filteredCategories = CATEGORIES.filter(cat => 
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isCategoryOpen) return;
    
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            setHighlightedIndex(prev => (prev + 1) % filteredCategories.length);
            break;
        case 'ArrowUp':
            e.preventDefault();
            setHighlightedIndex(prev => (prev - 1 + filteredCategories.length) % filteredCategories.length);
            break;
        case 'Enter':
            e.preventDefault();
            if (highlightedIndex >= 0 && filteredCategories[highlightedIndex]) {
                setCategory(filteredCategories[highlightedIndex]);
                setIsCategoryOpen(false);
            }
            break;
        case 'Escape':
            e.preventDefault();
            setIsCategoryOpen(false);
            break;
        default:
            break;
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
        const item = listRef.current.children[highlightedIndex] as HTMLLIElement;
        item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    const newExpense = {
        id: expenses.length + 1,
        description,
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString().split('T')[0],
    };
    setExpenses([newExpense, ...expenses]);
    setDescription('');
    setAmount('');
  };
  
  const handleIncrement = () => {
    setAmount(prev => ((parseFloat(prev) || 0) + 1).toFixed(2));
  };

  const handleDecrement = () => {
      setAmount(prev => {
          const value = (parseFloat(prev) || 0) - 1;
          return (value > 0 ? value : 0).toFixed(2);
      });
  };

  return (
    <FeaturePageLayout
      title="Expense Logging"
      description="Easily log shared expenses, attach receipts, and categorize your spending for a clear overview."
      Icon={ExpenseIcon}
    >
        <div 
          className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 snap-x snap-mandatory"
        >
            <div className="flex-shrink-0 w-full max-w-md snap-start">
                <Card>
                    <h2 className="text-2xl font-semibold mb-4">Log a New Expense</h2>
                    <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                            <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary" placeholder="e.g., Dinner with friends" />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-text-secondary mb-1">Amount ($)</label>
                            <div className="flex items-center w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-gray-600 rounded-md focus-within:ring-1 focus-within:ring-brand-primary">
                                <button type="button" onClick={handleDecrement} className="px-4 text-text-secondary hover:text-text-primary focus:outline-none" aria-label="Decrement amount">
                                    <MinusIcon />
                                </button>
                                <input 
                                    type="number" 
                                    id="amount" 
                                    value={amount} 
                                    onChange={e => setAmount(e.target.value)} 
                                    className="w-full text-center bg-transparent border-0 focus:ring-0 py-3 text-lg" 
                                    placeholder="0.00"
                                    step="0.01" 
                                />
                                <button type="button" onClick={handleIncrement} className="px-4 text-text-secondary hover:text-text-primary focus:outline-none" aria-label="Increment amount">
                                    <PlusIcon />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    type="button" 
                                    onClick={() => setIsCategoryOpen(prev => !prev)}
                                    className="w-full flex items-center justify-between px-4 py-4 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                >
                                    <span className="truncate">{category}</span>
                                    <motion.div
                                        animate={{ rotate: isCategoryOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDownSolidIcon className="w-6 h-6 text-text-secondary" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                {isCategoryOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="absolute z-10 w-full bottom-full mb-1 bg-light-card dark:bg-dark-bg border border-light-border dark:border-gray-600 rounded-md shadow-lg"
                                        style={{ transformOrigin: 'bottom' }}
                                    >
                                        
                                        <ul ref={listRef} className="max-h-60 overflow-y-auto p-1">
                                            {filteredCategories.length > 0 ? filteredCategories.map((cat, index) => (
                                                <li 
                                                    key={cat}
                                                    onClick={() => {
                                                        setCategory(cat);
                                                        setIsCategoryOpen(false);
                                                    }}
                                                    onMouseEnter={() => setHighlightedIndex(index)}
                                                    className={`px-3 py-2 rounded-md cursor-pointer text-sm ${highlightedIndex === index ? 'bg-brand-primary text-white' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
                                                >
                                                    {cat}
                                                </li>
                                            )) : (
                                                <li className="px-3 py-2 text-text-secondary text-sm">No categories found.</li>
                                            )}
                                        </ul>
                                        <div className="p-2 border-t border-light-border dark:border-gray-700">
                                            <input 
                                                ref={searchInputRef}
                                                type="text" 
                                                placeholder="Search categories..."
                                                value={categorySearch}
                                                onChange={(e) => {
                                                    setCategorySearch(e.target.value);
                                                    setHighlightedIndex(0);
                                                }}
                                                className="w-full px-3 py-2 bg-light-bg dark:bg-gray-800 border border-light-border dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <button type="submit" className="w-full px-4 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">Add Expense</button>
                    </form>
                </Card>
            </div>
            <div className="flex-shrink-0 w-full max-w-lg snap-start">
                <Card>
                    <h2 className="text-2xl font-semibold mb-4">Recent Expenses</h2>
                    <div className="space-y-3">
                        {expenses.map(expense => (
                            <div key={expense.id} className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/10 rounded-lg">
                                <div>
                                    <p className="font-medium">{expense.description}</p>
                                    <p className="text-sm text-text-secondary">{expense.category} - {expense.date}</p>
                                </div>
                                <p className="font-semibold text-lg">${expense.amount.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    </FeaturePageLayout>
  );
};

export default ExpenseLoggingPage;