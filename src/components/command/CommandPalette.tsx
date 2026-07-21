"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import {
  LayoutDashboard,
  MessageSquare,
  ScanSearch,
  Fingerprint,
  History,
  FileText,
  Search,
  Settings,
} from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

interface CommandItem {
  label: string;
  icon: typeof LayoutDashboard;
  action: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const items: CommandItem[] = useMemo(
    () => [
      { label: "Open Dashboard", icon: LayoutDashboard, action: () => router.push("/dashboard") },
      { label: "Start New Chat", icon: MessageSquare, action: () => router.push("/chat") },
      { label: "Analyze Image", icon: ScanSearch, action: () => router.push("/chat") },
      { label: "View Collector DNA", icon: Fingerprint, action: () => router.push("/dna") },
      { label: "Open DNA Evolution Replay", icon: History, action: () => router.push("/dna/replay") },
      { label: "Generate Legacy Report", icon: FileText, action: () => router.push("/legacy") },
      { label: "Search Collection", icon: Search, action: () => router.push("/collection") },
      { label: "Open Settings", icon: Settings, action: () => router.push("/settings") },
    ],
    [router]
  );

  const filtered = items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-[20%] z-[101] w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl glass-strong shadow-glass"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
            <Icon icon={Search} size="button" className="text-gray-500" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
            />
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-gray-400">ESC</kbd>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-sm text-gray-500">No matching commands.</p>
            )}
            {filtered.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.action();
                  setOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white"
              >
                <Icon icon={item.icon} size="default" className="text-gray-500" />
                {item.label}
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
