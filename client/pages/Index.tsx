import { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, BarChart3, FileText, Plus, ShieldAlert, Wallet, Camera } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip as ReTooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface Member { id: string; name: string; email: string; }
interface Group { id: string; name: string; description: string; currency: string; members: Member[]; enableFraud: boolean; }
interface Expense { id: string; date: string; description: string; category: string; amount: number; currency: string; payerId: string; participantIds: string[]; status: "approved" | "pending"; receipt?: string; convertedAmountUSD: number; }

const currencyRates: Record<string, number> = { USD: 1, EUR: 1.08, GBP: 1.25, INR: 0.012, JPY: 0.0066 };

function convertToUSD(amount: number, currency: string) { return Math.round((amount * (currencyRates[currency] ?? 1)) * 100) / 100; }

function useDemoData() {
  const members: Member[] = useMemo(() => [
    { id: "u1", name: "Alex", email: "alex@example.com" },
    { id: "u2", name: "Sam", email: "sam@example.com" },
    { id: "u3", name: "Jordan", email: "jordan@example.com" },
  ], []);
  const group: Group = useMemo(() => ({ id: "g1", name: "Roommates", description: "Apartment 12B", currency: "USD", members, enableFraud: true }), [members]);
  const initialExpenses: Expense[] = useMemo(() => [
    { id: "e1", date: new Date().toISOString(), description: "Groceries", category: "Food", amount: 120.5, currency: "USD", payerId: "u1", participantIds: ["u1","u2","u3"], status: "approved", convertedAmountUSD: 120.5 },
    { id: "e2", date: new Date(Date.now()-864e5*2).toISOString(), description: "Dinner", category: "Food", amount: 80, currency: "EUR", payerId: "u2", participantIds: ["u1","u2"], status: "approved", convertedAmountUSD: convertToUSD(80, "EUR") },
    { id: "e3", date: new Date(Date.now()-864e5*6).toISOString(), description: "Uber", category: "Travel", amount: 30, currency: "GBP", payerId: "u3", participantIds: ["u3","u2"], status: "pending", convertedAmountUSD: convertToUSD(30, "GBP") },
  ], []);
  return { group, initialExpenses };
}

function computeBalances(expenses: Expense[], members: Member[]) {
  const balance: Record<string, number> = {};
  for (const m of members) balance[m.id] = 0;
  for (const e of expenses) {
    const share = e.convertedAmountUSD / e.participantIds.length;
    for (const pid of e.participantIds) balance[pid] -= share;
    balance[e.payerId] += e.convertedAmountUSD;
  }
  return balance; // + means others owe you
}

function detectFraud(expenses: Expense[]) {
  const alerts: { id: string; title: string; detail: string; severity: "high" | "medium" | "low" }[] = [];
  const byKey = new Map<string, Expense[]>();
  for (const e of expenses) {
    const key = `${e.description.toLowerCase()}_${e.amount}_${e.currency}`;
    byKey.set(key, [...(byKey.get(key) ?? []), e]);
  }
  for (const [key, list] of byKey) {
    if (list.length > 1) {
      alerts.push({ id: `dup_${key}`, title: "Potential duplicate", detail: `Matches ${list.length} entries with same description and amount`, severity: "medium" });
    }
  }
  for (const e of expenses) {
    if (e.amount > 1000) alerts.push({ id: `amt_${e.id}`, title: "Unusually high amount", detail: `${e.description} at ${e.amount} ${e.currency}`, severity: "high" });
  }
  return alerts;
}

export default function Index() {
  const { group, initialExpenses } = useDemoData();
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [currency, setCurrency] = useState(group.currency);
  const [openAdd, setOpenAdd] = useState(false);
  const [alerts, setAlerts] = useState(() => detectFraud(initialExpenses));

  useEffect(() => { setAlerts(detectFraud(expenses)); }, [expenses]);

  const balances = useMemo(() => computeBalances(expenses, group.members), [expenses, group.members]);
  const trendData = useMemo(() => {
    const days = [...Array(30)].map((_, i) => new Date(Date.now() - (29 - i) * 864e5));
    return days.map((d) => {
      const dayStr = d.toISOString().slice(0, 10);
      const total = expenses
        .filter((e) => e.date.slice(0, 10) === dayStr)
        .reduce((acc, e) => acc + e.convertedAmountUSD, 0);
      return { day: d.getDate(), total: Math.round(total * 100) / 100 };
    });
  }, [expenses]);

  return (
    <main>
      <Hero onAdd={() => setOpenAdd(true)} />
      <section id="dashboard" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity className="size-5 text-primary" /> Last 30 days</CardTitle>
              <CardDescription>Expense trend in USD (auto-converted)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ReTooltip formatter={(v)=>`$${v}`} labelFormatter={(l)=>`Day ${l}`} />
                    <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="size-5 text-primary" /> Summary</CardTitle>
              <CardDescription>Real-time balances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {group.members.map((m) => {
                  const b = Math.round((balances[m.id] ?? 0) * 100) / 100;
                  return (
                    <div key={m.id} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{m.name}</span>
                      <span className={b >= 0 ? "text-emerald-600" : "text-rose-600"}>{b >= 0 ? "+$" + b : "-$" + Math.abs(b)}</span>
                    </div>
                  );
                })}
              </div>
              <Separator className="my-4" />
              <div className="text-xs text-muted-foreground">Base currency: {currency}</div>
              <div className="mt-2">
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger><SelectValue placeholder="Currency" /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(currencyRates).map((c)=>(<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="groups">
            <TabsList>
              <TabsTrigger value="groups">My Groups</TabsTrigger>
              <TabsTrigger value="balances">Balances</TabsTrigger>
              <TabsTrigger value="recent">Recent Expenses</TabsTrigger>
            </TabsList>
            <TabsContent value="groups" className="mt-4">
              <GroupsPanel group={group} />
            </TabsContent>
            <TabsContent value="balances" className="mt-4">
              <BalancesPanel members={group.members} balances={balances} />
            </TabsContent>
            <TabsContent value="recent" className="mt-4">
              <ExpenseTable expenses={expenses} members={group.members} />
            </TabsContent>
          </Tabs>
        </div>

        <div id="reports" className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="size-5 text-primary" /> Reports & Exports</CardTitle>
              <CardDescription>Download monthly summaries, tax breakdowns or CSV exports.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">Export CSV</Button>
                <Button variant="outline">Download PDF</Button>
                <Button>Generate Insights</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldAlert className="size-5 text-primary" /> Fraud Alerts</CardTitle>
              <CardDescription>Evidence-based anomaly detection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.length === 0 && <p className="text-sm text-muted-foreground">No alerts</p>}
                {alerts.map(a => (
                  <div key={a.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{a.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded ${a.severity === 'high' ? 'bg-rose-100 text-rose-700' : a.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{a.severity.toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{a.detail}</p>
                    <div className="mt-2 flex gap-2">
                      <Button variant="outline" size="sm">Review</Button>
                      <Button variant="ghost" size="sm">Dismiss</Button>
                      <Button variant="ghost" size="sm">Report</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <AddExpenseDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        members={group.members}
        onSubmit={(payload) => {
          const id = `e${Date.now()}`;
          const convertedAmountUSD = convertToUSD(payload.amount, payload.currency);
          const exp: Expense = { id, date: new Date().toISOString(), description: payload.description, category: payload.category, amount: payload.amount, currency: payload.currency, payerId: payload.payerId, participantIds: payload.participantIds, status: "pending", receipt: payload.receipt, convertedAmountUSD };
          setExpenses((prev) => [exp, ...prev]);
        }}
      />
    </main>
  );
}

function Hero({ onAdd }: { onAdd: () => void }) {
  return (
    <section id="features" className="relative overflow-hidden border-b">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.15),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.12),transparent_40%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              AI‑powered shared expenses with privacy at the core
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Create groups, log expenses in real time, get fair splits, settle in multiple currencies, and stay protected with anomaly detection.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="gap-2" onClick={onAdd}><Plus className="size-4" /> Add Expense</Button>
              <Button variant="outline" className="gap-2"><Wallet className="size-4" /> Create Group</Button>
            </div>
            <div id="security" className="mt-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="px-2 py-1 rounded bg-muted">End‑to‑end encryption</span>
              <span className="px-2 py-1 rounded bg-muted">2FA ready</span>
              <span className="px-2 py-1 rounded bg-muted">GDPR / PCI‑DSS aligned</span>
            </div>
          </div>
          <div className="lg:pl-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Snapshot</CardTitle>
                <CardDescription>Who owes whom right now</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Total Owed</p>
                    <p className="mt-2 text-2xl font-bold">$342.18</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Receivable</p>
                    <p className="mt-2 text-2xl font-bold">$289.71</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Active Groups</p>
                    <p className="mt-2 text-2xl font-bold">3</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Alerts</p>
                    <p className="mt-2 text-2xl font-bold">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function GroupsPanel({ group }: { group: Group }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
          <CardDescription>{group.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <p>Default currency: {group.currency}</p>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded ${group.enableFraud ? 'bg-emerald-100 text-emerald-700' : 'bg-muted'}`}>Fraud detection {group.enableFraud ? 'ON' : 'OFF'}</span>
            </div>
          </div>
          <Separator className="my-4" />
          <p className="text-sm font-medium mb-2">Members</p>
          <ul className="grid grid-cols-2 gap-2">
            {group.members.map(m => (
              <li key={m.id} className="rounded border p-2">
                <p className="font-medium">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.email}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <CreateJoinGroupCard />
    </div>
  );
}

function CreateJoinGroupCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create/Join Group</CardTitle>
        <CardDescription>Invite via email or link. Configure approval workflows.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input placeholder="Group name" />
          <Select defaultValue="USD">
            <SelectTrigger><SelectValue placeholder="Currency" /></SelectTrigger>
            <SelectContent>
              {Object.keys(currencyRates).map((c)=>(<SelectItem key={c} value={c}>{c}</SelectItem>))}
            </SelectContent>
          </Select>
          <Input placeholder="Invite emails (comma separated)" className="sm:col-span-2" />
          <div className="flex items-center gap-2 sm:col-span-2">
            <Checkbox id="fraud" defaultChecked />
            <Label htmlFor="fraud">Enable fraud detection</Label>
          </div>
          <Button className="sm:col-span-2">Create Group</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BalancesPanel({ members, balances }: { members: Member[]; balances: Record<string, number> }) {
  function settleSuggestions() {
    const creditors = members.map(m => ({ id: m.id, v: Math.round((balances[m.id]||0)*100)/100 })).filter(x=>x.v>0).sort((a,b)=>b.v-a.v);
    const debtors = members.map(m => ({ id: m.id, v: Math.round((balances[m.id]||0)*100)/100 })).filter(x=>x.v<0).sort((a,b)=>a.v-b.v);
    const tx: { from: string; to: string; amount: number }[] = [];
    let i=0,j=0; while(i<debtors.length && j<creditors.length){
      const pay = Math.min(-debtors[i].v, creditors[j].v);
      tx.push({ from: debtors[i].id, to: creditors[j].id, amount: Math.round(pay*100)/100 });
      debtors[i].v += pay; creditors[j].v -= pay;
      if (Math.abs(debtors[i].v) < 1e-9) i++; if (Math.abs(creditors[j].v) < 1e-9) j++;
    }
    return tx;
  }
  const tx = settleSuggestions();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settlement Calculator</CardTitle>
        <CardDescription>AI-recommended minimal transfers</CardDescription>
      </CardHeader>
      <CardContent>
        {tx.length === 0 && <p className="text-sm text-muted-foreground">No settlements needed</p>}
        <ul className="space-y-2">
          {tx.map((t, idx)=> (
            <li key={idx} className="flex items-center justify-between rounded border p-3">
              <span className="text-sm">{members.find(m=>m.id===t.from)?.name} → {members.find(m=>m.id===t.to)?.name}</span>
              <span className="font-medium">${t.amount}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <Button>Settle Now</Button>
          <Button variant="outline">View Options</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExpenseTable({ expenses, members }: { expenses: Expense[]; members: Member[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>Chronological list with conversions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Payer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map(e => (
              <TableRow key={e.id}>
                <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
                <TableCell>{e.description}</TableCell>
                <TableCell>{e.category}</TableCell>
                <TableCell>{members.find(m=>m.id===e.payerId)?.name}</TableCell>
                <TableCell>{e.amount} {e.currency} <span className="text-muted-foreground">(${e.convertedAmountUSD} USD)</span></TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded ${e.status==='approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{e.status.toUpperCase()}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function AddExpenseDialog({ open, onOpenChange, members, onSubmit }: { open: boolean; onOpenChange: (v:boolean)=>void; members: Member[]; onSubmit: (payload: { description: string; category: string; amount: number; currency: string; payerId: string; participantIds: string[]; receipt?: string; })=>void }) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [payerId, setPayerId] = useState(members[0]?.id ?? "");
  const [participantIds, setParticipantIds] = useState<string[]>(members.map(m=>m.id));
  const [receipt, setReceipt] = useState<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);

  function aiSuggestion() {
    const equal = amount / Math.max(1, participantIds.length);
    return `${participantIds.length} ways • ~$${Math.round(equal*100)/100} each`;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Plus className="size-4" /> Add Expense</DialogTitle>
          <DialogDescription>Upload a receipt or enter details. OCR extraction can prefill fields.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="e.g., Grocery run, Uber, Utilities" />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Food','Travel','Utilities','Rent','Entertainment','Other'].map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(currencyRates).map((c)=>(<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" min={0} step="0.01" value={amount} onChange={(e)=>setAmount(parseFloat(e.target.value||'0'))} />
          </div>
          <div>
            <Label>Payer</Label>
            <Select value={payerId} onValueChange={setPayerId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {members.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label>Participants</Label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {members.map(m => (
                <label key={m.id} className="flex items-center gap-2 rounded border p-2 cursor-pointer">
                  <Checkbox checked={participantIds.includes(m.id)} onCheckedChange={(v)=>{
                    const checked = Boolean(v);
                    setParticipantIds((prev)=> checked ? [...prev, m.id] : prev.filter(x=>x!==m.id));
                  }} />
                  <span className="text-sm">{m.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>Receipt</Label>
            <div className="mt-2 flex items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e)=>{
                const f = e.target.files?.[0];
                if (!f) return; const r = new FileReader(); r.onload = ()=> setReceipt(String(r.result)); r.readAsDataURL(f);
              }} />
              <Button type="button" variant="outline" className="gap-2" onClick={()=>fileRef.current?.click()}><Camera className="size-4" /> Upload image</Button>
              {receipt && <img src={receipt} alt="receipt" className="h-10 rounded border" />}
            </div>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-muted-foreground">AI suggestion: {aiSuggestion()}</p>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={()=>onOpenChange(false)}>Cancel</Button>
          <Button onClick={()=>{
            onSubmit({ description, category, amount, currency, payerId, participantIds, receipt });
            onOpenChange(false);
            setDescription(""); setCategory("Food"); setAmount(0); setCurrency("USD"); setPayerId(members[0]?.id ?? ""); setParticipantIds(members.map(m=>m.id)); setReceipt(undefined);
          }}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
