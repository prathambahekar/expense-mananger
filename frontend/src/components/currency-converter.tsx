import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeftRight, TrendingUp, DollarSign, RefreshCw } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

interface CurrencyConverterProps {
  onConvert?: (amount: number, from: string, to: string) => void;
}

// Mock exchange rates - in real app, this would come from an API
const mockExchangeRates: ExchangeRate[] = [
  { from: "USD", to: "EUR", rate: 0.85, lastUpdated: "2024-09-24T10:00:00Z" },
  { from: "USD", to: "GBP", rate: 0.73, lastUpdated: "2024-09-24T10:00:00Z" },
  { from: "USD", to: "JPY", rate: 110.25, lastUpdated: "2024-09-24T10:00:00Z" },
  { from: "USD", to: "CAD", rate: 1.25, lastUpdated: "2024-09-24T10:00:00Z" },
  { from: "USD", to: "AUD", rate: 1.35, lastUpdated: "2024-09-24T10:00:00Z" },
  { from: "EUR", to: "USD", rate: 1.18, lastUpdated: "2024-09-24T10:00:00Z" },
  { from: "EUR", to: "GBP", rate: 0.86, lastUpdated: "2024-09-24T10:00:00Z" },
  { from: "EUR", to: "JPY", rate: 130.15, lastUpdated: "2024-09-24T10:00:00Z" },
  { from: "GBP", to: "USD", rate: 1.37, lastUpdated: "2024-09-24T10:00:00Z" },
  { from: "GBP", to: "EUR", rate: 1.16, lastUpdated: "2024-09-24T10:00:00Z" },
];

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺" },
];

export function CurrencyConverter({ onConvert }: CurrencyConverterProps) {
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const getExchangeRate = (from: string, to: string): number => {
    if (from === to) return 1;
    
    // Direct rate
    const directRate = mockExchangeRates.find(rate => rate.from === from && rate.to === to);
    if (directRate) return directRate.rate;
    
    // Inverse rate
    const inverseRate = mockExchangeRates.find(rate => rate.from === to && rate.to === from);
    if (inverseRate) return 1 / inverseRate.rate;
    
    // Cross rate via USD
    if (from !== "USD" && to !== "USD") {
      const fromToUSD = getExchangeRate(from, "USD");
      const usdToTo = getExchangeRate("USD", to);
      return fromToUSD * usdToTo;
    }
    
    return 1; // Fallback
  };

  const handleConvert = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const rate = getExchangeRate(fromCurrency, toCurrency);
      const result = parseFloat(amount) * rate;
      setConvertedAmount(result);
      setLastUpdated(new Date().toISOString());
      setIsLoading(false);
      
      if (onConvert) {
        onConvert(parseFloat(amount), fromCurrency, toCurrency);
      }
      
      toast.success("Currency converted successfully!");
    }, 500);
  };

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    
    // If we have a converted amount, swap it with the original amount
    if (convertedAmount !== null) {
      setAmount(convertedAmount.toString());
      setConvertedAmount(parseFloat(amount));
    }
  };

  const getPopularRates = () => {
    return [
      { from: "USD", to: "EUR", rate: getExchangeRate("USD", "EUR") },
      { from: "USD", to: "GBP", rate: getExchangeRate("USD", "GBP") },
      { from: "EUR", to: "GBP", rate: getExchangeRate("EUR", "GBP") },
      { from: "USD", to: "JPY", rate: getExchangeRate("USD", "JPY") },
    ];
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return `${currency?.symbol || ''}${amount.toFixed(2)}`;
  };

  const getTimeSinceUpdate = (timestamp: string) => {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffMs = now.getTime() - updated.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Main Converter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Currency Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="text-2xl font-bold"
            />
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                        <span className="text-muted-foreground">{currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapCurrencies}
                className="rounded-full"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                        <span className="text-muted-foreground">{currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Convert Button */}
          <Button 
            onClick={handleConvert} 
            className="w-full" 
            size="lg"
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Converting...
              </>
            ) : (
              "Convert"
            )}
          </Button>

          {/* Result */}
          {convertedAmount !== null && (
            <div className="bg-muted/50 p-6 rounded-lg text-center">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Converted Amount</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(convertedAmount, toCurrency)}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span>
                    1 {fromCurrency} = {formatCurrency(getExchangeRate(fromCurrency, toCurrency), toCurrency)}
                  </span>
                  {lastUpdated && (
                    <>
                      <span>•</span>
                      <span>Updated {getTimeSinceUpdate(lastUpdated)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Popular Exchange Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Popular Exchange Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {getPopularRates().map((rate, index) => {
              const fromCurrency = currencies.find(c => c.code === rate.from);
              const toCurrency = currencies.find(c => c.code === rate.to);
              
              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span>{fromCurrency?.flag}</span>
                      <span className="font-medium">{rate.from}</span>
                    </div>
                    <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-1">
                      <span>{toCurrency?.flag}</span>
                      <span className="font-medium">{rate.to}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{rate.rate.toFixed(4)}</p>
                    <Badge variant="secondary" className="text-xs">
                      Live
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Exchange rates are updated in real-time and may include a small markup for conversion fees. 
              Rates shown are for reference only and actual conversion rates may vary.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Currency Settlement Info */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Currency Settlement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Auto-Settlement</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatically settle debts in preferred currency
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Real-time Rates</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Live exchange rates for accurate conversions
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Low Fees</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Competitive exchange rates with minimal fees
                </p>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Set Up Auto-Settlement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}