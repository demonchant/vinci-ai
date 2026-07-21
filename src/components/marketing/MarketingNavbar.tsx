import Link from "next/link";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "/market", label: "Market" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-md">
      <nav className="container flex h-16 items-center justify-between" aria-label="Primary">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          Vinci <span className="text-gradient">AI</span>
        </Link>

        <ul className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-300 hover:text-white">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-glow hover:bg-primary/90"
          >
            Start Collecting
          </Link>
        </div>
      </nav>
    </header>
  );
}
