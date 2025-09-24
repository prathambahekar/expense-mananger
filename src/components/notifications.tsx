import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Bell, AlertTriangle, TrendingUp, CheckCircle, X } from "lucide-react";
import { Expense } from "./expense-list";

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsProps {
  expenses: Expense[];
  budget: number;
}

export function Notifications({ expenses, budget }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Generate notifications based on expense data and budget
  const generateNotifications = (): Notification[] => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear &&
          expense.type === 'expense';
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    const budgetUsed = (monthlyExpenses / budget) * 100;
    const notifications: Notification[] = [];

    // Budget notifications
    if (budgetUsed >= 100) {
      notifications.push({
        id: 'budget-exceeded',
        type: 'alert',
        title: 'Budget Exceeded',
        message: `You've exceeded your monthly budget by ₹${(monthlyExpenses - budget).toFixed(2)}`,
        timestamp: new Date(),
        read: false
      });
    } else if (budgetUsed >= 80) {
      notifications.push({
        id: 'budget-warning',
        type: 'warning',
        title: 'Budget Warning',
        message: `You've used ${budgetUsed.toFixed(1)}% of your monthly budget`,
        timestamp: new Date(),
        read: false
      });
    }

    // Large expense notifications
    const recentLargeExpenses = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return expenseDate >= threeDaysAgo && expense.amount > 100 && expense.type === 'expense';
      });

    recentLargeExpenses.forEach(expense => {
      notifications.push({
        id: `large-expense-${expense.id}`,
        type: 'warning',
        title: 'Large Expense Alert',
        message: `${expense.description}: ₹${expense.amount.toFixed(2)}`,
        timestamp: new Date(expense.date),
        read: false
      });
    });

    // Income notifications
    const recentIncome = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return expenseDate >= threeDaysAgo && expense.type === 'income';
      });

    recentIncome.forEach(income => {
      notifications.push({
        id: `income-${income.id}`,
        type: 'success',
        title: 'Income Received',
        message: `${income.description}: +₹${income.amount.toFixed(2)}`,
        timestamp: new Date(income.date),
        read: false
      });
    });

    // Monthly summary (if it's the end of the month)
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    if (today.getDate() >= lastDayOfMonth - 2) {
      notifications.push({
        id: 'monthly-summary',
        type: 'info',
        title: 'Monthly Summary',
        message: `Total spent this month: ₹${monthlyExpenses.toFixed(2)}`,
        timestamp: new Date(),
        read: false
      });
    }

    return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const currentNotifications = generateNotifications();
  const unreadCount = currentNotifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-96">
          {currentNotifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {currentNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${!notification.read ? 'bg-muted/30' : ''
                      }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < currentNotifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {currentNotifications.length > 0 && (
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full" size="sm">
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}