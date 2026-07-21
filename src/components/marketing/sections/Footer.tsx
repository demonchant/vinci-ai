import Link from "next/link";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "AI Chat", href: "/chat" },
      { label: "Collector DNA", href: "/dna" },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Collector Memory", href: "/memory" },
      { label: "Evolution Replay", href: "/dna/replay" },
      { label: "Legacy Report", href: "/legacy" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/README.md" },
      { label: "GitHub", href: "https://github.com" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5">
      <div className="container grid gap-10 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-lg font-semibold">
            Vinci <span className="text-gradient">AI</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-gray-500">
            The AI Copilot for Every Collector. Built for the Renaiss Tech Hackathon.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container flex flex-col items-center justify-between gap-4 border-t border-white/5 py-6 text-xs text-gray-500 md:flex-row">
        <p>© {new Date().getFullYear()} Vinci AI. Built for demonstration purposes.</p>
        <Link href="/contact" className="hover:text-white">
          Contact
        </Link>
      </div>
    </footer>
  );
}
