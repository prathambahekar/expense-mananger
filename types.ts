
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Balance {
  groupId: string;
  groupName?: string;
  net: number;
  currency: string;
}

export interface ExpenseShare {
  userId: string;
  share: number;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  payer: {
    id: string;
    name: string;
  };
  shares: ExpenseShare[];
  groupId: string;
}

export interface SettlementSuggestion {
  from: string;
  to: string;
  amount: number;
  currency: string;
}

export interface FraudAlert {
  id: string;
  expenseId: string;
  score: number;
  reason: string;
}

export interface DashboardData {
  balances: Balance[];
  expenses: Expense[];
  settlementSuggestions: SettlementSuggestion[];
  fraudAlerts: FraudAlert[];
}

export interface Group {
  id: string;
  name: string;
  memberCount: number;
  members: User[];
  inviteCode: string;
}

export enum SplitType {
  Equal = 'equal',
  Proportional = 'proportional',
  Exact = 'exact',
}

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD'];

