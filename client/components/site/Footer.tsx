export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Shared Expense Manager. Privacy-first group finances.
        </p>
        <nav className="flex items-center gap-4">
          <a href="#security" className="hover:text-foreground">Security</a>
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#reports" className="hover:text-foreground">Reports</a>
        </nav>
      </div>
    </footer>
  );
}
