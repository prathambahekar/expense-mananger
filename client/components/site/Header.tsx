import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ShieldCheck, BellRing, Sun, Moon, User } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 to-emerald-500" />
              <span className="font-extrabold tracking-tight text-lg sm:text-xl">
                Shared Expense Manager
              </span>
            </Link>
            <nav className="ml-8 hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/groups" className="hover:text-foreground">Groups</Link>
              <Link to="/expenses/add" className="hover:text-foreground">Add Expense</Link>
              <Link to="/settlements" className="hover:text-foreground">Settlements</Link>
              <Link to="/profile" className="hover:text-foreground">Profile</Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" className="gap-2" aria-label="Notifications">
              <BellRing className="size-4" /> Alerts
            </Button>
            <Button variant="outline" className="gap-2" aria-label="Privacy">
              <ShieldCheck className="size-4" /> Privacy
            </Button>
            <Button variant="ghost" onClick={()=> setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Link to="/profile"><Button className="gap-2" aria-label="Profile"><User className="size-4" /> You</Button></Link>
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
            <Link to="/groups" className="block px-2 py-2 rounded hover:bg-muted">Groups</Link>
            <Link to="/expenses/add" className="block px-2 py-2 rounded hover:bg-muted">Add Expense</Link>
            <Link to="/settlements" className="block px-2 py-2 rounded hover:bg-muted">Settlements</Link>
            <Link to="/profile" className="block px-2 py-2 rounded hover:bg-muted">Profile</Link>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1">Privacy</Button>
              <Button className="flex-1" onClick={()=> setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Light' : 'Dark'}</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
