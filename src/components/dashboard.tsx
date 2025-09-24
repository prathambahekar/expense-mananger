import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

interface DashboardProps {
  totalExpenses: number;
  monthlyExpenses: number;
  avgDailySpend: number;
  budget: number;
}

export function Dashboard({ totalExpenses, monthlyExpenses, avgDailySpend, budget }: DashboardProps) {
  const budgetUsed = (monthlyExpenses / budget) * 100;
  const budgetRemaining = budget - monthlyExpenses;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          {/* INR icon can be added here if available, else just remove DollarSign */}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">All time spending</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{monthlyExpenses.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Current month spending</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{avgDailySpend.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Average per day</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{budgetRemaining.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {budgetUsed.toFixed(1)}% of budget used
          </p>
        </CardContent>
      </Card>
    </div>
  );
}