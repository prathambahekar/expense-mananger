import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { BarChart3, Home, List, PieChart, Settings, Menu, Wallet } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "transactions", label: "Transactions", icon: List },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "budget", label: "Budget", icon: Wallet },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const NavContent = () => (
    <div className="flex flex-col space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className="justify-start"
            onClick={() => {
              onTabChange(item.id);
              setIsOpen(false);
            }}
          >
            <Icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex md:flex-col md:w-64 md:border-r md:bg-card md:p-4">
        <div className="flex items-center mb-6">
          <PieChart className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">ExpenseTracker</h1>
        </div>
        <NavContent />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex items-center mb-6">
              <PieChart className="h-6 w-6 mr-2" />
              <h1 className="text-xl font-bold">ExpenseTracker</h1>
            </div>
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}