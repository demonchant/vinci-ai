import { SUGGESTED_PROMPTS } from "@/types/chat";

export function SuggestedPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTED_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/10 hover:text-white"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
