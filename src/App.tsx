import { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Dashboard } from "./components/dashboard";
import { ExpenseList, Expense } from "./components/expense-list";
import { AddExpenseDialog } from "./components/add-expense-dialog";
import { SpendingChart } from "./components/spending-chart";
import { BudgetTracker } from "./components/budget-tracker";
import { Notifications } from "./components/notifications";
import { Settings } from "./components/settings";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

// Mock data for demonstration
const initialExpenses: Expense[] = [
  { id: "1", description: "Grocery Shopping", amount: 85.50, category: "food", date: "2024-09-20", type: "expense" },
  { id: "2", description: "Gas Station", amount: 45.00, category: "transport", date: "2024-09-19", type: "expense" },
  { id: "3", description: "Netflix Subscription", amount: 15.99, category: "entertainment", date: "2024-09-18", type: "expense" },
  { id: "4", description: "Salary", amount: 3500.00, category: "income", date: "2024-09-15", type: "income" },
  { id: "5", description: "Restaurant Dinner", amount: 67.80, category: "food", date: "2024-09-17", type: "expense" },
  { id: "6", description: "Electric Bill", amount: 120.00, category: "bills", date: "2024-09-16", type: "expense" },
  { id: "7", description: "Coffee Shop", amount: 12.50, category: "food", date: "2024-09-15", type: "expense" },
  { id: "8", description: "Uber Ride", amount: 23.40, category: "transport", date: "2024-09-14", type: "expense" },
  { id: "9", description: "Online Course", amount: 89.99, category: "education", date: "2024-09-13", type: "expense" },
  { id: "10", description: "Freelance Work", amount: 450.00, category: "income", date: "2024-09-12", type: "income" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [budget, setBudget] = useState(2000);

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString(),
    };
    setExpenses(prev => [expense, ...prev]);
    toast.success(`${newExpense.type === 'income' ? 'Income' : 'Expense'} added successfully!`);
  };

  const handleExportData = () => {
    const data = {
      expenses,
      budget,
      exportDate: new Date().toISOString(),
      version: "1.0.0"
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (data: any) => {
    if (data.expenses && Array.isArray(data.expenses)) {
      setExpenses(data.expenses);
    }
    if (data.budget && typeof data.budget === 'number') {
      setBudget(data.budget);
    }
  };

  const handleClearData = () => {
    setExpenses([]);
    setBudget(2000);
  };

  // Calculate dashboard metrics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const totalExpenses = expenses
    .filter(expense => expense.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear &&
             expense.type === 'expense';
    })
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const avgDailySpend = monthlyExpenses / new Date().getDate();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
              </div>
              <div className="flex items-center gap-3">
                <Notifications expenses={expenses} budget={budget} />
                <AddExpenseDialog onAddExpense={addExpense} />
              </div>
            </div>
            <Dashboard 
              totalExpenses={totalExpenses}
              monthlyExpenses={monthlyExpenses}
              avgDailySpend={avgDailySpend}
              budget={budget}
            />
            <ExpenseList expenses={expenses.slice(0, 5)} />
          </div>
        );
      
      case "transactions":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Transactions</h1>
                <p className="text-muted-foreground">View and manage all your transactions.</p>
              </div>
              <div className="flex items-center gap-3">
                <Notifications expenses={expenses} budget={budget} />
                <AddExpenseDialog onAddExpense={addExpense} />
              </div>
            </div>
            <ExpenseList expenses={expenses} />
          </div>
        );
      
      case "analytics":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">Insights into your spending patterns.</p>
              </div>
              <Notifications expenses={expenses} budget={budget} />
            </div>
            <SpendingChart expenses={expenses} />
          </div>
        );
      
      case "budget":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Budget</h1>
                <p className="text-muted-foreground">Track your budget and spending goals.</p>
              </div>
              <Notifications expenses={expenses} budget={budget} />
            </div>
            <BudgetTracker 
              expenses={expenses} 
              budget={budget} 
              onBudgetUpdate={setBudget}
            />
          </div>
        );
      
      case "settings":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Customize your app experience and manage your data.</p>
              </div>
              <Notifications expenses={expenses} budget={budget} />
            </div>
            <Settings 
              onExportData={handleExportData}
              onImportData={handleImportData}
              onClearData={handleClearData}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-6 md:ml-0">
          <div className="max-w-7xl mx-auto">
            {renderActiveTab()}
          </div>
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}