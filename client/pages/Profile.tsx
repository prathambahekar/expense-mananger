import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  setToken,
  setUser,
  getUser,
  getDefaultCurrency,
  setDefaultCurrency,
} from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

export default function Profile() {
  const navigate = useNavigate();
  const user = getUser<any>();
  const [currency, setCurrency] = useState(getDefaultCurrency());

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded border p-3">
            <p className="font-medium">{user?.name || "User"}</p>
            <p className="text-sm text-muted-foreground">
              {user?.email || "you@example.com"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Default currency</p>
            <Select
              value={currency}
              onValueChange={(v) => {
                setCurrency(v);
                setDefaultCurrency(v);
              }}
            >
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

          <Button
            onClick={() => {
              setToken(null);
              setUser(null);
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
