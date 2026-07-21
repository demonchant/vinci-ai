"use client";

import { useChat } from "ai/react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import { Copy, RefreshCw, Square } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import type { ChatMessage } from "@/types/chat";
import { MarkdownMessage } from "@/components/chat/MarkdownMessage";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";
import { ImageDropzone } from "@/components/chat/ImageDropzone";
import { ChatContextPanel } from "@/components/chat/ChatContextPanel";
import { UpdateToastStack, type UpdateNotice } from "@/components/chat/UpdateToast";
import { CollectibleCard } from "@/components/chat/RichCards";

export default function ChatThreadPage() {
  return (
    <Suspense fallback={null}>
      <ChatThread />
    </Suspense>
  );
}

function ChatThread() {
  const { chatId } = useParams<{ chatId: string }>();
  const searchParams = useSearchParams();
  const [input, setInput] = useState(searchParams.get("prompt") ?? "");
  const [initialMessages, setInitialMessages] = useState<ChatMessage[] | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [notices, setNotices] = useState<UpdateNotice[]>([]);
  const [pendingAnalyses, setPendingAnalyses] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/chat/${chatId}`)
      .then((r) => r.json())
      .then((data) => {
        setInitialMessages(data.chat?.messages ?? []);
        setIsDemo(Boolean(data.demo));
      });
  }, [chatId]);

  const { messages, append, isLoading, stop, reload } = useChat({
    api: "/api/chat",
    id: chatId,
    body: { chatId },
    initialMessages: (initialMessages ?? []).map((m) => ({
      id: m.id,
      role: m.role.toLowerCase() as "user" | "assistant",
      content: m.content,
    })),
    onFinish: async () => {
      // Check whether this turn created a checkpoint, and surface a
      // subtle, non-intrusive notice if so — never a blocking popup.
      const res = await fetch(`/api/chat/${chatId}/checkpoints`);
      if (!res.ok) return;
      const data = await res.json();
      const latest = data.checkpoints?.[0];
      if (!latest) return;
      const isRecent = Date.now() - new Date(latest.createdAt).getTime() < 15_000;
      if (!isRecent) return;
      setNotices((prev) => [
        ...prev,
        {
          kind: latest.checkpointTitle.startsWith("Collector DNA") ? "dna" : "memory",
          message: latest.checkpointTitle,
        },
      ]);
      setTimeout(() => setNotices((prev) => prev.slice(1)), 5000);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isDemo) return;
    const text = input;
    setInput("");
    await append({ role: "user", content: text });
  }

  function handleAnalyzed(result: { imageUrl: string; analysis: any }) {
    setPendingAnalyses((prev) => [...prev, result]);
  }

  return (
    <div className="flex flex-1">
      <div className="container flex flex-1 flex-col py-6">
        {isDemo && (
          <p className="mb-3 rounded-lg bg-white/5 px-3 py-2 text-xs text-gray-400">
            This conversation is demonstration data. Sign up to chat with Vinci AI about your own
            collection.
          </p>
        )}

        <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin pb-4">
          {messages.length === 0 && (
            <div className="pt-10">
              <SuggestedPrompts onSelect={(p) => setInput(p)} />
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-2xl rounded-2xl px-4 py-3 text-sm ${
                m.role === "user" ? "ml-auto bg-primary text-white" : "glass"
              }`}
            >
              {m.role === "assistant" ? <MarkdownMessage content={m.content} /> : m.content}
              {m.role === "assistant" && (
                <div className="mt-2 flex gap-2 border-t border-white/5 pt-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(m.content)}
                    className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-300"
                  >
                    <Icon icon={Copy} size={13} /> Copy
                  </button>
                  <button
                    onClick={() => reload()}
                    className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-300"
                  >
                    <Icon icon={RefreshCw} size={13} /> Regenerate
                  </button>
                </div>
              )}
            </div>
          ))}

          {pendingAnalyses.map((a, i) => (
            <CollectibleCard
              key={i}
              title={a.analysis.identification}
              category={a.analysis.category ?? "Unknown"}
              estimatedValue={
                a.analysis.valueRangeLow
                  ? `$${a.analysis.valueRangeLow}–$${a.analysis.valueRangeHigh}`
                  : null
              }
              confidence={a.analysis.confidenceScore}
            />
          ))}

          {isLoading && (
            <div className="glass flex max-w-fit items-center gap-2 rounded-2xl px-4 py-3 text-sm text-gray-400">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
              </span>
              Vinci AI is thinking...
              <button onClick={() => stop()} className="ml-2 text-gray-500 hover:text-gray-300">
                <Icon icon={Square} size={12} />
              </button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="space-y-3 border-t border-white/5 pt-4">
          {!isDemo && <ImageDropzone onAnalyzed={handleAnalyzed} />}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isDemo}
              placeholder={
                isDemo
                  ? "Sign up to send messages of your own"
                  : "Ask about a collectible, rarity, value, or authenticity..."
              }
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-primary disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isDemo}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <ChatContextPanel chatId={chatId} />
      <UpdateToastStack notices={notices} />
    </div>
  );
}
