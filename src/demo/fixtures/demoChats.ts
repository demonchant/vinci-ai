import type { AIChatDetail } from "@/types/chat";

function msg(id: string, role: "USER" | "ASSISTANT", content: string, minutesAgo: number) {
  return {
    id,
    chatId: "",
    role,
    content,
    imageUrls: [],
    createdAt: new Date(Date.now() - minutesAgo * 60_000).toISOString(),
  };
}

export const demoChats: AIChatDetail[] = [
  {
    id: "demo-chat-1",
    title: "Is this Charizard authentic?",
    isPinned: true,
    lastMessagePreview: "Based on the holo pattern and font weight, this matches...",
    updatedAt: new Date(Date.now() - 60 * 60_000).toISOString(),
    messages: [
      msg("m1", "USER", "Is this 1998 holo Charizard authentic? I'm worried it's a reprint.", 65),
      msg(
        "m2",
        "ASSISTANT",
        "Based on the holo pattern, font weight, and copyright line placement in your photo, this matches genuine 1998 Base Set printing characteristics. The shadowless variant has a slightly different layout than what you've shown, so this appears to be the standard first-edition run, not a known reprint pattern. I'd still recommend professional grading for a purchase at this price point; this is an AI estimate, not a certified authentication.",
        64
      ),
    ],
  },
  {
    id: "demo-chat-2",
    title: "Compare LeBron rookie vs Jordan rookie",
    isPinned: false,
    lastMessagePreview: "Your Jordan rookie has significantly outperformed...",
    updatedAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString(),
    messages: [
      msg("m3", "USER", "Compare my 2003 LeBron rookie and 1986 Fleer Jordan rookie as holds.", 190),
      msg(
        "m4",
        "ASSISTANT",
        "Since you mostly hold vintage, authenticated cards long-term, the Jordan rookie fits that pattern better. It's appreciated roughly 39% since your purchase versus 54% for the LeBron, but the Jordan has a much deeper collector base and lower supply at PSA 8+. Both are strong holds given your risk profile; I wouldn't suggest selling either soon.",
        188
      ),
    ],
  },
  {
    id: "demo-chat-3",
    title: "Should I hold the Apollo 11 patch?",
    isPinned: false,
    lastMessagePreview: "Space memorabilia has shown steady, low-volatility demand...",
    updatedAt: new Date(Date.now() - 26 * 60 * 60_000).toISOString(),
    messages: [
      msg("m5", "USER", "Should I hold or sell the Apollo 11 mission patch?", 1570),
      msg(
        "m6",
        "ASSISTANT",
        "Space memorabilia has shown steady, low-volatility demand rather than sharp swings, which usually rewards patience over quick flips, and that lines up with how you've held everything else in your collection. Unless you need liquidity, I'd hold this one.",
        1568
      ),
    ],
  },
];
