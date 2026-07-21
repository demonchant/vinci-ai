"use client";

import { useRouter } from "next/navigation";
import { MessageSquare } from "@/components/ui/icons";
import { FeatureIcon } from "@/components/ui/icon-components";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";

export default function ChatIndexPage() {
  const router = useRouter();

  async function startChat(initialMessage?: string) {
    const res = await fetch("/api/chat/list", { method: "POST" });
    const data = await res.json();
    if (data.chat?.id) {
      const url = initialMessage
        ? `/chat/${data.chat.id}?prompt=${encodeURIComponent(initialMessage)}`
        : `/chat/${data.chat.id}`;
      router.push(url);
    }
  }

  return (
    <div className="container flex flex-1 flex-col items-center justify-center py-10 text-center">
      <FeatureIcon icon={MessageSquare} className="h-14 w-14" />
      <h1 className="mt-4 font-display text-2xl">Talk to your collection</h1>
      <p className="mt-2 max-w-md text-sm text-gray-500">
        Vinci AI remembers your preferences, understands your collection, and updates your
        Collector DNA as you talk.
      </p>
      <div className="mt-6">
        <SuggestedPrompts onSelect={(prompt) => startChat(prompt)} />
      </div>
      <button
        onClick={() => startChat()}
        className="mt-8 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow hover:bg-primary/90"
      >
        Start a new chat
      </button>
    </div>
  );
}
