import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Users, Plus, Shield, AlertTriangle, DollarSign, CreditCard } from "lucide-react";
import { toast } from "sonner@2.0.3";

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member';
  balance: number;
  currency: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  currency: string;
  members: GroupMember[];
  totalExpenses: number;
  createdAt: string;
  isActive: boolean;
  securityScore: number;
}

export interface GroupExpense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: string;
  splitAmong: string[];
  splitMethod: 'equal' | 'percentage' | 'exact' | 'shares';
  splitDetails: Record<string, number>;
  category: string;
  date: string;
  fraudScore: number;
  isVerified: boolean;
  receipts: string[];
}

const mockGroups: Group[] = [
  {
    id: "1",
    name: "Roommates",
    description: "Shared apartment expenses",
    currency: "USD",
    totalExpenses: 1250.00,
    createdAt: "2024-09-01",
    isActive: true,
    securityScore: 98,
    members: [
      { id: "1", name: "You", email: "you@example.com", role: "admin", balance: -125.50, currency: "USD" },
      { id: "2", name: "Alice Johnson", email: "alice@example.com", role: "member", balance: 67.25, currency: "USD" },
      { id: "3", name: "Bob Smith", email: "bob@example.com", role: "member", balance: 58.25, currency: "USD" },
    ]
  },
  {
    id: "2",
    name: "Europe Trip 2024",
    description: "Vacation expenses in Europe",
    currency: "EUR",
    totalExpenses: 2340.00,
    createdAt: "2024-08-15",
    isActive: false,
    securityScore: 95,
    members: [
      { id: "1", name: "You", email: "you@example.com", role: "admin", balance: 245.67, currency: "EUR" },
      { id: "4", name: "Sarah Wilson", email: "sarah@example.com", role: "member", balance: -122.34, currency: "EUR" },
      { id: "5", name: "Mike Davis", email: "mike@example.com", role: "member", balance: -123.33, currency: "EUR" },
    ]
  }
];

interface GroupManagementProps {
  onCreateGroup: (group: Omit<Group, 'id' | 'createdAt'>) => void;
}

export function GroupManagement({ onCreateGroup }: GroupManagementProps) {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: "",
    description: "",
    currency: "USD"
  });

  const getSecurityBadge = (score: number) => {
    if (score >= 95) return { color: "bg-green-100 text-green-800", text: "Secure" };
    if (score >= 85) return { color: "bg-yellow-100 text-yellow-800", text: "Good" };
    return { color: "bg-red-100 text-red-800", text: "At Risk" };
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-green-600";
    if (balance < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  const handleCreateGroup = () => {
    if (!newGroupData.name.trim()) {
      toast.error("Group name is required");
      return;
    }

    const newGroup: Omit<Group, 'id' | 'createdAt'> = {
      ...newGroupData,
      members: [
        { 
          id: "1", 
          name: "You", 
          email: "you@example.com", 
          role: "admin", 
          balance: 0, 
          currency: newGroupData.currency 
        }
      ],
      totalExpenses: 0,
      isActive: true,
      securityScore: 100
    };

    onCreateGroup(newGroup);
    setGroups(prev => [...prev, { ...newGroup, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
    setNewGroupData({ name: "", description: "", currency: "USD" });
    setIsCreateDialogOpen(false);
    toast.success("Group created successfully!");
  };

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Group Management</h2>
          <p className="text-muted-foreground">Manage your expense groups and members</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={newGroupData.name}
                  onChange={(e) => setNewGroupData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter group name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupDescription">Description</Label>
                <Input
                  id="groupDescription"
                  value={newGroupData.description}
                  onChange={(e) => setNewGroupData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter group description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupCurrency">Currency</Label>
                <Select 
                  value={newGroupData.currency} 
                  onValueChange={(value) => setNewGroupData(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGroup}>Create Group</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Groups Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => {
          const securityBadge = getSecurityBadge(group.securityScore);
          return (
            <Card key={group.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {group.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge 
                      className={securityBadge.color}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {securityBadge.text}
                    </Badge>
                    <Badge variant={group.isActive ? "default" : "secondary"}>
                      {group.isActive ? "Active" : "Settled"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Expenses</span>
                    <span className="font-medium">
                      {currencies.find(c => c.code === group.currency)?.symbol}
                      {group.totalExpenses.toLocaleString()}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Members ({group.members.length})</p>
                    <div className="space-y-2">
                      {group.members.slice(0, 3).map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{member.name}</span>
                            {member.role === 'admin' && (
                              <Badge variant="outline" className="text-xs">Admin</Badge>
                            )}
                          </div>
                          <span className={`text-sm font-medium ${getBalanceColor(member.balance)}`}>
                            {member.balance > 0 ? '+' : ''}
                            {currencies.find(c => c.code === member.currency)?.symbol}
                            {Math.abs(member.balance).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      {group.members.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{group.members.length - 3} more members
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Security Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            AI Security Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Secure Groups</span>
              </div>
              <p className="text-2xl font-bold">{groups.filter(g => g.securityScore >= 95).length}</p>
              <p className="text-xs text-muted-foreground">High security score</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Flagged Transactions</span>
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">Potential fraud detected</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Multi-Currency</span>
              </div>
              <p className="text-2xl font-bold">{new Set(groups.map(g => g.currency)).size}</p>
              <p className="text-xs text-muted-foreground">Currencies in use</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}