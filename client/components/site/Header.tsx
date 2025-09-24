import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ShieldCheck, Wallet, BellRing } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-emerald-500" />
              <span className="font-extrabold tracking-tight text-lg sm:text-xl">
                Shared Expense Manager
              </span>
            </Link>
            <nav className="ml-8 hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground">
                Features
              </a>
              <a href="#dashboard" className="hover:text-foreground">
                Dashboard
              </a>
              <a href="#reports" className="hover:text-foreground">
                Reports
              </a>
              <a href="#security" className="hover:text-foreground">
                Security
              </a>
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" className="gap-2">
              <BellRing className="size-4" /> Alerts
            </Button>
            <Button variant="outline" className="gap-2">
              <ShieldCheck className="size-4" /> Privacy
            </Button>
            <Button className="gap-2">
              <Wallet className="size-4" /> Sign in
            </Button>
          </div>
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md border"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
        {open && (
          <div className="md:hidden py-3 space-y-2">
            <a
              href="#features"
              className="block px-2 py-2 rounded hover:bg-muted"
            >
              Features
            </a>
            <a
              href="#dashboard"
              className="block px-2 py-2 rounded hover:bg-muted"
            >
              Dashboard
            </a>
            <a
              href="#reports"
              className="block px-2 py-2 rounded hover:bg-muted"
            >
              Reports
            </a>
            <a
              href="#security"
              className="block px-2 py-2 rounded hover:bg-muted"
            >
              Security
            </a>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1">
                Privacy
              </Button>
              <Button className="flex-1">Sign in</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
