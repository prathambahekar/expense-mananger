import { useEffect, useMemo, useState } from "react";
import { api, getUser } from "@/services/api";
import { toast } from "react-toastify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js";
import { Link } from "react-router-dom";
import { ShieldAlert, TrendingUp, Users } from "lucide-react";

ChartJS.register(ArcElement, ChartTooltip, Legend);

export default function Dashboard() {
  const user = getUser<{ id: string; name: string }>();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const uid = user?.id || "demo";
        const { data } = await api.get(`/dashboard/${uid}`);
        setData(data);
      } catch (e) {
        toast.warn("Using sample dashboard data (API unavailable)");
        setData({
          net: -42.35,
          history: [
            { id: "1", date: new Date().toISOString(), desc: "Dinner", amount: 24.5, currency: "USD", payer: "Alex", share: 8.17 },
            { id: "2", date: new Date(Date.now()-864e5).toISOString(), desc: "Taxi", amount: 18.0, currency: "USD", payer: "Sam", share: 9 },
          ],
          split: { Food: 120, Travel: 60, Utilities: 40, Other: 25 },
          settlements: [ { to: "Sam", amount: 18 }, { to: "Jordan", amount: 24.35 } ],
          alerts: [ { id: "a1", title: "Potential duplicate", detail: "Matches entry from yesterday" } ],
          groups: [ { id: "g1", name: "Roommates", members: 3 } ],
        });
      }
    }
    load();
  }, []);

  const chartData = useMemo(() => {
    const entries = data?.split || {};
    const labels = Object.keys(entries);
    const values = Object.values(entries);
    return {
      labels,
      datasets: [
        {
          label: "Distribution",
          data: values,
          backgroundColor: [
            "#34d399",
            "#60a5fa",
            "#a78bfa",
            "#fbbf24",
            "#f472b6",
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [data]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="size-5 text-primary" /> Net Balance</CardTitle>
            <CardDescription>Overall position</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${data?.net >= 0 ? 'text-emerald-500' : 'text-rose-400'}`}>{data ? `$${Math.abs(data.net).toFixed(2)}` : "—"}</p>
            <p className="text-sm text-muted-foreground mt-2">{data?.net >= 0 ? "You are owed" : "You owe"}</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="size-5 text-primary" /> Split Distribution</CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <Doughnut data={chartData} options={{ plugins: { legend: { position: 'bottom', labels: { color: 'hsl(var(--foreground))' } } } }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
            <CardDescription>Recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead>Your Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.history || []).map((e: any) => (
                  <TableRow key={e.id}>
                    <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
                    <TableCell>{e.desc}</TableCell>
                    <TableCell>${e.amount.toFixed(2)}</TableCell>
                    <TableCell>{e.currency}</TableCell>
                    <TableCell>{e.payer}</TableCell>
                    <TableCell>${e.share.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settlement Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(data?.settlements || []).map((s: any, i: number) => (
                <div key={i} className="flex items-center justify-between rounded border p-3">
                  <span>Pay {s.to}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">${s.amount.toFixed(2)}</span>
                    <Button size="sm" variant="outline">Mark Paid</Button>
                  </div>
                </div>
              ))}
              <Link to="/settlements"><Button className="w-full" variant="secondary">Open Settlements</Button></Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldAlert className="size-5 text-primary" /> Fraud Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(data?.alerts || []).map((a: any) => (
                <div key={a.id} className="rounded border p-3">
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.detail}</p>
                </div>
              ))}
              <Link to="/groups"><Button className="w-full" variant="outline">Manage Groups</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
