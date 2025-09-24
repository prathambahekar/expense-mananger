import {
    ExpenseIcon,
    GroupIcon,
    SettleIcon,
    ReportIcon,
    AIIcon,
    IntegrationIcon,
    GamifyIcon,
    DashboardIcon,
    SettingsIcon
} from './assets/icons';

export const NAV_LINKS = [
    { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
    { name: 'Log Expense', href: '/features/expenses', icon: ExpenseIcon },
    { name: 'Groups', href: '/features/groups', icon: GroupIcon },
    { name: 'Settlements', href: '/features/settlements', icon: SettleIcon },
    { name: 'Reports', href: '/features/reports', icon: ReportIcon },
    { name: 'AI Features', href: '/features/ai', icon: AIIcon },
    { name: 'Integrations', href: '/features/integrations', icon: IntegrationIcon },
    { name: 'Gamification', href: '/features/gamification', icon: GamifyIcon },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

export const FEATURES = [
  {
    name: 'Expense Logging',
    description: 'Easily log shared expenses, attach receipts, and categorize your spending for a clear overview.',
    href: '/features/expenses',
    icon: ExpenseIcon,
  },
  {
    name: 'Group Management',
    description: 'Create groups for trips, roommates, or projects. Keep all related expenses organized in one place.',
    href: '/features/groups',
    icon: GroupIcon,
  },
  {
    name: 'Smart Settlements',
    description: 'Settle up with a single tap. We calculate who owes whom, simplifying complex debts into easy payments.',
    href: '/features/settlements',
    icon: SettleIcon,
  },
  {
    name: 'Reports & Analytics',
    description: 'Visualize your spending habits with beautiful charts. Understand where your money goes and budget smarter.',
    href: '/features/reports',
    icon: ReportIcon,
  },
  {
    name: 'AI-Powered Features',
    description: 'Get personalized saving tips and fraud alerts. Our AI analyzes your spending to keep you financially secure.',
    href: '/features/ai',
    icon: AIIcon,
  },
  {
    name: 'Seamless Integrations',
    description: 'Connect with your favorite payment apps like PayPal, Venmo, and UPI for quick and easy settlements.',
    href: '/features/integrations',
    icon: IntegrationIcon,
  },
  {
    name: 'Gamification',
    description: 'Earn badges for financial milestones and compete with friends on leaderboards. Making finance fun!',
    href: '/features/gamification',
    icon: GamifyIcon,
  },
];

export const CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.5 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 157 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.78 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.25 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 90 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rate: 10.5 }
];