import Link from "next/link";
import {
  LayoutDashboard,
  MessageSquare,
  Database,
  FolderOpen,
  Fingerprint,
  FileText,
  TrendingUp,
  Settings,
  ScanSearch,
  Brain,
  Clock,
} from "@/components/ui/icons";
import { NavigationIcon } from "@/components/ui/icon-components";
import { DemoModeBanner } from "@/components/demo/DemoModeBanner";
import { CommandPalette } from "@/components/command/CommandPalette";
import { isDemoMode } from "@/services/demoMode";

// Icon mapping follows the app-wide convention: Dashboard, Chat, Memory,
// Collection, DNA, Legacy, Market, Settings each have exactly one icon,
// used nowhere else, so the sidebar is instantly scannable.
const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/image-analysis", label: "Image Lab", icon: ScanSearch },
  { href: "/memory", label: "Memory", icon: Database },
  { href: "/collection", label: "Collection", icon: FolderOpen },
  { href: "/dna", label: "Collector DNA", icon: Fingerprint },
  { href: "/legacy", label: "Legacy Report", icon: FileText },
  { href: "/market", label: "Market", icon: TrendingUp },
  { href: "/twin", label: "Collector Twin", icon: Brain },
  { href: "/journey", label: "Journey", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const demo = await isDemoMode();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-col border-r border-white/5 p-4 md:flex">
        <Link href="/dashboard" className="mb-8 px-2 text-lg font-semibold">
          Vinci <span className="text-gradient">AI</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
            >
              <NavigationIcon icon={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col overflow-y-auto">
        {demo && <DemoModeBanner />}
        <main className="flex-1">{children}</main>
      </div>
      <CommandPalette />
    </div>
  );
}
