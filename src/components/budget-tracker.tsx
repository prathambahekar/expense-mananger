import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Edit2, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { Expense } from "./expense-list";

interface BudgetTrackerProps {
  expenses: Expense[];
  budget: number;
  onBudgetUpdate: (newBudget: number) => void;
}

interface CategoryBudget {
  category: string;
  budget: number;
  spent: number;
}

export function BudgetTracker({ expenses, budget, onBudgetUpdate }: BudgetTrackerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget.toString());

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear &&
             expense.type === 'expense';
    });

  const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budgetUsed = (totalSpent / budget) * 100;
  const remaining = budget - totalSpent;

  // Category budgets (you could make this configurable)
  const defaultCategoryBudgets: Record<string, number> = {
    food: budget * 0.3,
    transport: budget * 0.15,
    entertainment: budget * 0.1,
    shopping: budget * 0.15,
    bills: budget * 0.25,
    health: budget * 0.05,
  };

  const categoryBudgets: CategoryBudget[] = Object.entries(defaultCategoryBudgets).map(([category, categoryBudget]) => {
    const spent = monthlyExpenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      category,
      budget: categoryBudget,
      spent,
    };
  });

  const handleBudgetSave = () => {
    const parsed = parseFloat(newBudget);
    if (!isNaN(parsed) && parsed > 0) {
      onBudgetUpdate(parsed);
      setIsEditing(false);
    }
  };

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return { status: "exceeded", color: "destructive" };
    if (percentage >= 80) return { status: "warning", color: "yellow" };
    return { status: "good", color: "green" };
  };

  const overallStatus = getBudgetStatus(totalSpent, budget);

  return (
    <div className="space-y-6">
      {/* Overall Budget Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Monthly Budget
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                placeholder="Enter budget amount"
              />
              <Button onClick={handleBudgetSave}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">${budget.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Monthly budget</p>
                </div>
                <Badge 
                  variant={overallStatus.status === "exceeded" ? "destructive" : "secondary"}
                  className={
                    overallStatus.status === "good" ? "bg-green-100 text-green-800" :
                    overallStatus.status === "warning" ? "bg-yellow-100 text-yellow-800" : ""
                  }
                >
                  {overallStatus.status === "exceeded" ? "Over Budget" :
                   overallStatus.status === "warning" ? "Near Limit" : "On Track"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Spent: ${totalSpent.toLocaleString()}</span>
                  <span>Remaining: ${remaining.toLocaleString()}</span>
                </div>
                <Progress 
                  value={Math.min(budgetUsed, 100)} 
                  className="h-2"
                />
                <p className="text-sm text-muted-foreground">
                  {budgetUsed.toFixed(1)}% of budget used
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Category Budgets */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryBudgets.map((item) => {
              const percentage = (item.spent / item.budget) * 100;
              const status = getBudgetStatus(item.spent, item.budget);
              
              return (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="capitalize font-medium">{item.category}</span>
                      {status.status === "exceeded" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                      {status.status === "good" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">${item.spent.toFixed(2)}</span>
                      <span className="text-muted-foreground"> / ${item.budget.toFixed(2)}</span>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-1"
                  />
                  <p className="text-xs text-muted-foreground">
                    {percentage.toFixed(1)}% used
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}