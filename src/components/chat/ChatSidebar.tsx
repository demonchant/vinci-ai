"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Pin, Plus, FolderOpen, Database } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface ChatSummary {
  id: string;
  title: string;
  isPinned: boolean;
  lastMessagePreview: string | null;
}

export function ChatSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/chat/list")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.chats ?? []).map((c: any) => ({
          id: c.id,
          title: c.title,
          isPinned: c.isPinned,
          lastMessagePreview: c.messages?.[0]?.content ?? c.lastMessagePreview ?? null,
        }));
        setChats(list);
      });
  }, [pathname]);

  const filtered = query
    ? chats.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
    : chats;
  const pinned = filtered.filter((c) => c.isPinned);
  const recent = filtered.filter((c) => !c.isPinned);

  async function handleNewChat() {
    const res = await fetch("/api/chat/list", { method: "POST" });
    const data = await res.json();
    if (data.chat?.id) router.push(`/chat/${data.chat.id}`);
  }

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-white/5 p-4 lg:flex">
      <button
        onClick={handleNewChat}
        className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-white shadow-glow hover:bg-primary/90"
      >
        <Icon icon={Plus} size="button" />
        New chat
      </button>

      <div className="relative mb-4">
        <Icon icon={Search} size="button" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search chats"
          className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="mb-4 flex gap-2">
        <Link
          href="/collection"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 px-2 py-1.5 text-xs text-gray-300 hover:bg-white/10"
        >
          <Icon icon={FolderOpen} size="button" />
          Collection
        </Link>
        <Link
          href="/memory"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 px-2 py-1.5 text-xs text-gray-300 hover:bg-white/10"
        >
          <Icon icon={Database} size="button" />
          Memory
        </Link>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin">
        {pinned.length > 0 && (
          <div>
            <p className="mb-1.5 px-1 text-xs font-medium uppercase tracking-wide text-gray-500">Pinned</p>
            {pinned.map((c) => (
              <ChatRow key={c.id} chat={c} active={pathname === `/chat/${c.id}`} />
            ))}
          </div>
        )}
        <div>
          <p className="mb-1.5 px-1 text-xs font-medium uppercase tracking-wide text-gray-500">Recent</p>
          {recent.length === 0 && <p className="px-1 text-sm text-gray-600">No conversations yet.</p>}
          {recent.map((c) => (
            <ChatRow key={c.id} chat={c} active={pathname === `/chat/${c.id}`} />
          ))}
        </div>
      </div>
    </aside>
  );
}

function ChatRow({ chat, active }: { chat: ChatSummary; active: boolean }) {
  return (
    <Link
      href={`/chat/${chat.id}`}
      className={cn(
        "block rounded-lg px-2.5 py-2 text-sm transition",
        active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
      )}
    >
      <span className="flex items-center gap-1.5 truncate">
        {chat.isPinned && <Icon icon={Pin} size={12} className="shrink-0 text-accent" />}
        <span className="truncate">{chat.title}</span>
      </span>
    </Link>
  );
}
