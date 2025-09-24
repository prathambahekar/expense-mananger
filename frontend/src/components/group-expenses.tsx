import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { AlertTriangle, CheckCircle, Plus, Receipt, Shield, Users, Calculator, CreditCard } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { GroupExpense, Group, GroupMember } from "./group-management";

interface GroupExpensesProps {
  groups: Group[];
  onAddExpense: (expense: Omit<GroupExpense, 'id'>) => void;
}

const mockGroupExpenses: GroupExpense[] = [
  {
    id: "1",
    groupId: "1",
    description: "Grocery Shopping - Whole Foods",
    amount: 156.78,
    currency: "USD",
    paidBy: "1",
    splitAmong: ["1", "2", "3"],
    splitMethod: "equal",
    splitDetails: { "1": 52.26, "2": 52.26, "3": 52.26 },
    category: "food",
    date: "2024-09-22",
    fraudScore: 15,
    isVerified: true,
    receipts: ["receipt1.jpg"]
  },
  {
    id: "2", 
    groupId: "1",
    description: "Electricity Bill",
    amount: 89.50,
    currency: "USD",
    paidBy: "2",
    splitAmong: ["1", "2", "3"],
    splitMethod: "equal",
    splitDetails: { "1": 29.83, "2": 29.83, "3": 29.84 },
    category: "bills",
    date: "2024-09-20",
    fraudScore: 5,
    isVerified: true,
    receipts: []
  },
  {
    id: "3",
    groupId: "1", 
    description: "Expensive Restaurant Dinner",
    amount: 450.00,
    currency: "USD",
    paidBy: "3",
    splitAmong: ["1", "2", "3"],
    splitMethod: "equal",
    splitDetails: { "1": 150.00, "2": 150.00, "3": 150.00 },
    category: "food",
    date: "2024-09-19",
    fraudScore: 85,
    isVerified: false,
    receipts: []
  }
];

export function GroupExpenses({ groups, onAddExpense }: GroupExpensesProps) {
  const [expenses, setExpenses] = useState<GroupExpense[]>(mockGroupExpenses);
  const [selectedGroup, setSelectedGroup] = useState<string>(groups[0]?.id || "");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newExpenseData, setNewExpenseData] = useState({
    description: "",
    amount: "",
    category: "food",
    splitMethod: "equal" as "equal" | "percentage" | "exact" | "shares",
    splitAmong: [] as string[],
    splitDetails: {} as Record<string, number>
  });

  const selectedGroupData = groups.find(g => g.id === selectedGroup);
  const groupExpenses = expenses.filter(e => e.groupId === selectedGroup);

  const calculateFairSplit = (amount: number, method: string, members: GroupMember[]) => {
    const memberCount = members.length;
    
    switch (method) {
      case "equal":
        return members.reduce((acc, member) => {
          acc[member.id] = amount / memberCount;
          return acc;
        }, {} as Record<string, number>);
      
      case "percentage":
        // For demo, equal percentages
        return members.reduce((acc, member) => {
          acc[member.id] = amount * (100 / memberCount / 100);
          return acc;
        }, {} as Record<string, number>);
      
      default:
        return members.reduce((acc, member) => {
          acc[member.id] = amount / memberCount;
          return acc;
        }, {} as Record<string, number>);
    }
  };

  const detectFraud = (expense: Partial<GroupExpense>): number => {
    let fraudScore = 0;
    
    // Amount-based detection
    if (expense.amount && expense.amount > 300) fraudScore += 30;
    if (expense.amount && expense.amount > 500) fraudScore += 40;
    
    // Category-based detection
    if (expense.category === "entertainment" && expense.amount && expense.amount > 200) fraudScore += 20;
    
    // Time-based detection (multiple large expenses in short time)
    const recentExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return expenseDate >= oneDayAgo && e.amount > 100;
    });
    
    if (recentExpenses.length > 2) fraudScore += 25;
    
    // Lack of receipt for large amounts
    if (expense.amount && expense.amount > 100 && (!expense.receipts || expense.receipts.length === 0)) {
      fraudScore += 15;
    }
    
    return Math.min(fraudScore, 100);
  };

  const getFraudBadge = (score: number) => {
    if (score >= 70) return { color: "bg-red-100 text-red-800", text: "High Risk", icon: AlertTriangle };
    if (score >= 40) return { color: "bg-yellow-100 text-yellow-800", text: "Medium Risk", icon: AlertTriangle };
    if (score >= 20) return { color: "bg-orange-100 text-orange-800", text: "Low Risk", icon: Shield };
    return { color: "bg-green-100 text-green-800", text: "Verified", icon: CheckCircle };
  };

  const handleAddExpense = () => {
    if (!newExpenseData.description || !newExpenseData.amount || !selectedGroupData) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(newExpenseData.amount);
    const selectedMembers = selectedGroupData.members.filter(m => 
      newExpenseData.splitAmong.includes(m.id)
    );
    
    if (selectedMembers.length === 0) {
      toast.error("Please select members to split the expense among");
      return;
    }

    const splitDetails = calculateFairSplit(amount, newExpenseData.splitMethod, selectedMembers);
    const fraudScore = detectFraud({
      amount,
      category: newExpenseData.category,
      receipts: []
    });

    const newExpense: Omit<GroupExpense, 'id'> = {
      groupId: selectedGroup,
      description: newExpenseData.description,
      amount,
      currency: selectedGroupData.currency,
      paidBy: "1", // Current user
      splitAmong: newExpenseData.splitAmong,
      splitMethod: newExpenseData.splitMethod,
      splitDetails,
      category: newExpenseData.category,
      date: new Date().toISOString().split('T')[0],
      fraudScore,
      isVerified: fraudScore < 70,
      receipts: []
    };

    setExpenses(prev => [...prev, { ...newExpense, id: Date.now().toString() }]);
    onAddExpense(newExpense);
    
    // Reset form
    setNewExpenseData({
      description: "",
      amount: "",
      category: "food",
      splitMethod: "equal",
      splitAmong: [],
      splitDetails: {}
    });
    
    setIsAddDialogOpen(false);
    
    if (fraudScore >= 70) {
      toast.error("High fraud risk detected! Please review this expense.");
    } else {
      toast.success("Group expense added successfully!");
    }
  };

  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "JPY", symbol: "¥" },
  ];

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || "$";
  };

  if (!selectedGroupData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No groups available. Create a group first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map(group => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedGroupData.members.length} members • {getCurrencySymbol(selectedGroupData.currency)} currency
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Group Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Group Expense</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="split">Split Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={newExpenseData.description}
                      onChange={(e) => setNewExpenseData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What was this expense for?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount ({getCurrencySymbol(selectedGroupData.currency)})</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newExpenseData.amount}
                      onChange={(e) => setNewExpenseData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={newExpenseData.category} 
                    onValueChange={(value) => setNewExpenseData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="transport">Transportation</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="bills">Bills & Utilities</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="split" className="space-y-4">
                <div className="space-y-2">
                  <Label>Split Method</Label>
                  <Select 
                    value={newExpenseData.splitMethod} 
                    onValueChange={(value: any) => setNewExpenseData(prev => ({ ...prev, splitMethod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal">Equal Split</SelectItem>
                      <SelectItem value="percentage">Percentage Split</SelectItem>
                      <SelectItem value="exact">Exact Amounts</SelectItem>
                      <SelectItem value="shares">Share-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Split Among</Label>
                  <div className="space-y-2">
                    {selectedGroupData.members.map(member => (
                      <div key={member.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={newExpenseData.splitAmong.includes(member.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewExpenseData(prev => ({
                                ...prev,
                                splitAmong: [...prev.splitAmong, member.id]
                              }));
                            } else {
                              setNewExpenseData(prev => ({
                                ...prev,
                                splitAmong: prev.splitAmong.filter(id => id !== member.id)
                              }));
                            }
                          }}
                        />
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddExpense}>Add Expense</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* AI Fraud Detection Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            AI Fraud Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold">{groupExpenses.length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold text-green-600">
                {groupExpenses.filter(e => e.isVerified).length}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Flagged</p>
              <p className="text-2xl font-bold text-red-600">
                {groupExpenses.filter(e => e.fraudScore >= 70).length}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg. Risk Score</p>
              <p className="text-2xl font-bold">
                {groupExpenses.length > 0 
                  ? Math.round(groupExpenses.reduce((sum, e) => sum + e.fraudScore, 0) / groupExpenses.length)
                  : 0
                }%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Group Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {groupExpenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No expenses found for this group
              </div>
            ) : (
              groupExpenses.map((expense) => {
                const fraudBadge = getFraudBadge(expense.fraudScore);
                const FraudIcon = fraudBadge.icon;
                const paidByMember = selectedGroupData.members.find(m => m.id === expense.paidBy);
                
                return (
                  <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{expense.description}</p>
                          <Badge className={fraudBadge.color}>
                            <FraudIcon className="h-3 w-3 mr-1" />
                            {fraudBadge.text}
                          </Badge>
                          {expense.receipts.length > 0 && (
                            <Badge variant="outline">
                              <Receipt className="h-3 w-3 mr-1" />
                              Receipt
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Paid by {paidByMember?.name}</span>
                          <span>Split among {expense.splitAmong.length} members</span>
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {getCurrencySymbol(expense.currency)}{expense.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getCurrencySymbol(expense.currency)}{(expense.amount / expense.splitAmong.length).toFixed(2)} per person
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}