import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api, getUser, getDefaultCurrency } from "@/services/api";
import { toast } from "react-toastify";

const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "INR",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "SGD",
  "NZD",
  "SEK",
  "NOK",
  "DKK",
];

export default function Groups() {
  const user = getUser<{ id: string; name: string }>() || {
    id: "demo",
    name: "Demo",
  };
  const [groups, setGroups] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState(getDefaultCurrency());
  const [invites, setInvites] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      const { data } = await api.get(`/groups/${user.id}`);
      setGroups(data.groups || []);
    } catch {
      setGroups([]);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function onCreate() {
    try {
      setLoading(true);
      const { data } = await api.post("/groups", {
        name,
        defaultCurrency: currency,
        creatorId: user.id,
        memberEmails: invites
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      toast.success("Group created");
      setOpen(false);
      setName("");
      setInvites("");
      setGroups((prev) => [data.group, ...prev]);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Groups</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Group</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new group</DialogTitle>
              <DialogDescription>
                Choose a name, default currency, and invite members by email.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm font-medium" htmlFor="gname">
                  Group name
                </label>
                <Input
                  id="gname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Roommates"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Default currency</label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="invites">
                  Invite by email (comma separated)
                </label>
                <Input
                  id="invites"
                  value={invites}
                  onChange={(e) => setInvites(e.target.value)}
                  placeholder="a@ex.com, b@ex.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={onCreate} disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {groups.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No groups yet</CardTitle>
            <CardDescription>
              Create your first group to start tracking expenses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setOpen(true)}>Create Group</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((g) => (
            <Card key={g.id}>
              <CardHeader>
                <CardTitle>{g.name}</CardTitle>
                <CardDescription>Currency: {g.defaultCurrency}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span>Members</span>
                  <span className="font-medium">{g.members?.length ?? 1}</span>
                </div>
                <div className="mt-3">
                  <Button variant="outline">Open</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
