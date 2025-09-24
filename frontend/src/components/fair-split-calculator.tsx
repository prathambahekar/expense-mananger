import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calculator, Users, Percent, DollarSign, TrendingUp, Brain } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface SplitMember {
  id: string;
  name: string;
  percentage?: number;
  exactAmount?: number;
  shares?: number;
  income?: number;
  paymentCapacity?: number;
}

interface SplitResult {
  memberId: string;
  memberName: string;
  amount: number;
  percentage: number;
  fairnessScore: number;
}

const mockMembers: SplitMember[] = [
  { id: "1", name: "You", income: 75000, paymentCapacity: 0.85 },
  { id: "2", name: "Alice", income: 65000, paymentCapacity: 0.90 },
  { id: "3", name: "Bob", income: 85000, paymentCapacity: 0.80 },
  { id: "4", name: "Charlie", income: 55000, paymentCapacity: 0.75 },
];

export function FairSplitCalculator() {
  const [totalAmount, setTotalAmount] = useState("300");
  const [splitMethod, setSplitMethod] = useState<"equal" | "percentage" | "exact" | "shares" | "income" | "ai">("equal");
  const [members, setMembers] = useState<SplitMember[]>(mockMembers);
  const [results, setResults] = useState<SplitResult[]>([]);
  const [aiFactors, setAiFactors] = useState({
    incomeWeight: 40,
    capacityWeight: 30,
    historyWeight: 20,
    equalityWeight: 10
  });

  const calculateEqualSplit = (amount: number): SplitResult[] => {
    const perMember = amount / members.length;
    return members.map(member => ({
      memberId: member.id,
      memberName: member.name,
      amount: perMember,
      percentage: 100 / members.length,
      fairnessScore: 100
    }));
  };

  const calculatePercentageSplit = (amount: number): SplitResult[] => {
    const totalPercentage = members.reduce((sum, member) => sum + (member.percentage || 0), 0);
    
    if (Math.abs(totalPercentage - 100) > 0.01) {
      toast.error("Percentages must add up to 100%");
      return [];
    }

    return members.map(member => ({
      memberId: member.id,
      memberName: member.name,
      amount: amount * ((member.percentage || 0) / 100),
      percentage: member.percentage || 0,
      fairnessScore: 95
    }));
  };

  const calculateExactSplit = (amount: number): SplitResult[] => {
    const totalExact = members.reduce((sum, member) => sum + (member.exactAmount || 0), 0);
    
    if (Math.abs(totalExact - amount) > 0.01) {
      toast.error(`Exact amounts must add up to $${amount.toFixed(2)}`);
      return [];
    }

    return members.map(member => ({
      memberId: member.id,
      memberName: member.name,
      amount: member.exactAmount || 0,
      percentage: ((member.exactAmount || 0) / amount) * 100,
      fairnessScore: 90
    }));
  };

  const calculateSharesSplit = (amount: number): SplitResult[] => {
    const totalShares = members.reduce((sum, member) => sum + (member.shares || 1), 0);
    
    return members.map(member => {
      const memberShares = member.shares || 1;
      const memberAmount = amount * (memberShares / totalShares);
      return {
        memberId: member.id,
        memberName: member.name,
        amount: memberAmount,
        percentage: (memberShares / totalShares) * 100,
        fairnessScore: 92
      };
    });
  };

  const calculateIncomeSplit = (amount: number): SplitResult[] => {
    const totalIncome = members.reduce((sum, member) => sum + (member.income || 50000), 0);
    
    return members.map(member => {
      const memberIncome = member.income || 50000;
      const percentage = (memberIncome / totalIncome) * 100;
      const memberAmount = amount * (memberIncome / totalIncome);
      
      // Calculate fairness score based on income proportion
      const avgIncome = totalIncome / members.length;
      const incomeRatio = memberIncome / avgIncome;
      const fairnessScore = Math.max(70, Math.min(100, 100 - Math.abs(incomeRatio - 1) * 30));
      
      return {
        memberId: member.id,
        memberName: member.name,
        amount: memberAmount,
        percentage,
        fairnessScore
      };
    });
  };

  const calculateAISplit = (amount: number): SplitResult[] => {
    // AI-powered fair split considering multiple factors
    const weights = {
      income: aiFactors.incomeWeight / 100,
      capacity: aiFactors.capacityWeight / 100,
      history: aiFactors.historyWeight / 100,
      equality: aiFactors.equalityWeight / 100
    };

    return members.map(member => {
      const income = member.income || 50000;
      const capacity = member.paymentCapacity || 0.8;
      
      // Normalize factors
      const avgIncome = members.reduce((sum, m) => sum + (m.income || 50000), 0) / members.length;
      const avgCapacity = members.reduce((sum, m) => sum + (m.paymentCapacity || 0.8), 0) / members.length;
      
      const incomeScore = income / avgIncome;
      const capacityScore = capacity / avgCapacity;
      const historyScore = 1.0; // Mock history score
      const equalityScore = 1.0; // Base equality
      
      // Calculate weighted score
      const totalScore = (
        incomeScore * weights.income +
        capacityScore * weights.capacity +
        historyScore * weights.history +
        equalityScore * weights.equality
      );
      
      const totalScores = members.reduce((sum, m) => {
        const mIncome = m.income || 50000;
        const mCapacity = m.paymentCapacity || 0.8;
        const mIncomeScore = mIncome / avgIncome;
        const mCapacityScore = mCapacity / avgCapacity;
        
        return sum + (
          mIncomeScore * weights.income +
          mCapacityScore * weights.capacity +
          1.0 * weights.history +
          1.0 * weights.equality
        );
      }, 0);
      
      const percentage = (totalScore / totalScores) * 100;
      const memberAmount = amount * (totalScore / totalScores);
      
      // Calculate fairness score
      const fairnessScore = Math.min(100, 85 + (capacity * 15));
      
      return {
        memberId: member.id,
        memberName: member.name,
        amount: memberAmount,
        percentage,
        fairnessScore
      };
    });
  };

  const calculateSplit = () => {
    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    let newResults: SplitResult[] = [];

    switch (splitMethod) {
      case "equal":
        newResults = calculateEqualSplit(amount);
        break;
      case "percentage":
        newResults = calculatePercentageSplit(amount);
        break;
      case "exact":
        newResults = calculateExactSplit(amount);
        break;
      case "shares":
        newResults = calculateSharesSplit(amount);
        break;
      case "income":
        newResults = calculateIncomeSplit(amount);
        break;
      case "ai":
        newResults = calculateAISplit(amount);
        break;
    }

    if (newResults.length > 0) {
      setResults(newResults);
      toast.success("Split calculated successfully!");
    }
  };

  const updateMemberData = (memberId: string, field: string, value: number) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, [field]: value }
        : member
    ));
  };

  const getFairnessColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getFairnessBadge = (score: number) => {
    if (score >= 90) return { color: "bg-green-100 text-green-800", text: "Very Fair" };
    if (score >= 75) return { color: "bg-yellow-100 text-yellow-800", text: "Fair" };
    return { color: "bg-red-100 text-red-800", text: "Unfair" };
  };

  const averageFairnessScore = results.length > 0 
    ? results.reduce((sum, result) => sum + result.fairnessScore, 0) / results.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fair Split Calculator</h2>
          <p className="text-muted-foreground">Calculate fair expense splits using AI algorithms</p>
        </div>
        {averageFairnessScore > 0 && (
          <Badge className={getFairnessBadge(averageFairnessScore).color}>
            <Brain className="h-3 w-3 mr-1" />
            {getFairnessBadge(averageFairnessScore).text} ({averageFairnessScore.toFixed(0)}%)
          </Badge>
        )}
      </div>

      {/* Main Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Split Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={splitMethod} onValueChange={(value) => setSplitMethod(value as any)}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="equal">Equal</TabsTrigger>
              <TabsTrigger value="percentage">%</TabsTrigger>
              <TabsTrigger value="exact">Exact</TabsTrigger>
              <TabsTrigger value="shares">Shares</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="ai">AI Fair</TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>Total Amount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="Enter total amount"
                  className="text-xl font-bold"
                />
              </div>

              <TabsContent value="equal" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Split the amount equally among all members.
                </p>
              </TabsContent>

              <TabsContent value="percentage" className="space-y-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Set custom percentages for each member (must total 100%).
                  </p>
                  {members.map(member => (
                    <div key={member.id} className="flex items-center gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="flex-1">{member.name}</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={member.percentage || 0}
                          onChange={(e) => updateMemberData(member.id, 'percentage', parseFloat(e.target.value))}
                          className="w-20"
                        />
                        <span>%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="exact" className="space-y-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Set exact amounts for each member.
                  </p>
                  {members.map(member => (
                    <div key={member.id} className="flex items-center gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="flex-1">{member.name}</span>
                      <div className="flex items-center gap-2">
                        <span>$</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={member.exactAmount || 0}
                          onChange={(e) => updateMemberData(member.id, 'exactAmount', parseFloat(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="shares" className="space-y-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Assign shares to each member (proportional split).
                  </p>
                  {members.map(member => (
                    <div key={member.id} className="flex items-center gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="flex-1">{member.name}</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={member.shares || 1}
                          onChange={(e) => updateMemberData(member.id, 'shares', parseInt(e.target.value))}
                          className="w-20"
                        />
                        <span>shares</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="income" className="space-y-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Split based on income levels (proportional to earnings).
                  </p>
                  {members.map(member => (
                    <div key={member.id} className="flex items-center gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="flex-1">{member.name}</span>
                      <div className="flex items-center gap-2">
                        <span>$</span>
                        <Input
                          type="number"
                          step="1000"
                          min="0"
                          value={member.income || 50000}
                          onChange={(e) => updateMemberData(member.id, 'income', parseFloat(e.target.value))}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">/year</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    AI-powered fair split considering income, payment capacity, history, and equality.
                  </p>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">AI Fairness Factors</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Income Weight</span>
                          <span>{aiFactors.incomeWeight}%</span>
                        </div>
                        <Slider
                          value={[aiFactors.incomeWeight]}
                          onValueChange={(value) => setAiFactors(prev => ({ ...prev, incomeWeight: value[0] }))}
                          max={100}
                          step={5}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Payment Capacity Weight</span>
                          <span>{aiFactors.capacityWeight}%</span>
                        </div>
                        <Slider
                          value={[aiFactors.capacityWeight]}
                          onValueChange={(value) => setAiFactors(prev => ({ ...prev, capacityWeight: value[0] }))}
                          max={100}
                          step={5}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Payment History Weight</span>
                          <span>{aiFactors.historyWeight}%</span>
                        </div>
                        <Slider
                          value={[aiFactors.historyWeight]}
                          onValueChange={(value) => setAiFactors(prev => ({ ...prev, historyWeight: value[0] }))}
                          max={100}
                          step={5}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Equality Weight</span>
                          <span>{aiFactors.equalityWeight}%</span>
                        </div>
                        <Slider
                          value={[aiFactors.equalityWeight]}
                          onValueChange={(value) => setAiFactors(prev => ({ ...prev, equalityWeight: value[0] }))}
                          max={100}
                          step={5}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <Button onClick={calculateSplit} className="w-full" size="lg">
                Calculate Split
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Split Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map(result => {
                const fairnessBadge = getFairnessBadge(result.fairnessScore);
                return (
                  <div key={result.memberId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{result.memberName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{result.memberName}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            {result.percentage.toFixed(1)}% of total
                          </p>
                          <Badge className={fairnessBadge.color} variant="secondary">
                            {result.fairnessScore.toFixed(0)}% fair
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">${result.amount.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">
                    ${results.reduce((sum, result) => sum + result.amount, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                  <span>Average Fairness Score</span>
                  <span className={getFairnessColor(averageFairnessScore)}>
                    {averageFairnessScore.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}