import { NextRequest } from "next/server";
import { resolveViewer } from "@/lib/viewer";
import { computeCollectorDNA } from "@/services/dnaEngine";
import { listAchievements } from "@/services/achievementService";

/**
 * Returns a server-rendered SVG DNA Card — no html2canvas, no browser APIs,
 * no flakiness. The SVG is directly downloadable or embeddable anywhere.
 */
export async function GET(_req: NextRequest) {
  const { userId, demo } = await resolveViewer();

  let score = 72;
  let type = "HISTORIAN";
  let unlockedCount = 3;

  if (!demo) {
    const [dna, achievements] = await Promise.all([
      computeCollectorDNA(userId),
      listAchievements(userId),
    ]);
    score = dna.dnaScore;
    type = dna.primaryType;
    unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A0A0F"/>
      <stop offset="100%" stop-color="#111118"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6D5DFB"/>
      <stop offset="100%" stop-color="#00D4FF"/>
    </linearGradient>
    <clipPath id="card"><rect width="400" height="240" rx="20"/></clipPath>
  </defs>

  <!-- Background -->
  <rect width="400" height="240" rx="20" fill="url(#bg)"/>
  <rect width="400" height="240" rx="20" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" clip-path="url(#card)"/>

  <!-- Accent bar -->
  <rect x="0" y="0" width="400" height="3" rx="1.5" fill="url(#accent)"/>

  <!-- Logo / brand -->
  <text x="24" y="36" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#6D5DFB" letter-spacing="2">VINCI AI</text>
  <text x="24" y="50" font-family="system-ui,sans-serif" font-size="9" fill="rgba(255,255,255,0.3)" letter-spacing="1">COLLECTOR DNA</text>

  <!-- Score -->
  <text x="200" y="110" font-family="Georgia,serif" font-size="72" font-weight="700" fill="white" text-anchor="middle" opacity="0.95">${score}</text>
  <text x="200" y="130" font-family="system-ui,sans-serif" font-size="10" fill="rgba(255,255,255,0.35)" text-anchor="middle" letter-spacing="3">COLLECTOR SCORE</text>

  <!-- Archetype -->
  <text x="200" y="165" font-family="system-ui,sans-serif" font-size="16" font-weight="600" fill="#00D4FF" text-anchor="middle">${type}</text>

  <!-- Stats row -->
  <text x="80" y="200" font-family="system-ui,sans-serif" font-size="11" fill="white" text-anchor="middle" font-weight="600">${unlockedCount}</text>
  <text x="80" y="214" font-family="system-ui,sans-serif" font-size="9" fill="rgba(255,255,255,0.35)" text-anchor="middle">ACHIEVEMENTS</text>

  <line x1="160" y1="195" x2="160" y2="218" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <line x1="240" y1="195" x2="240" y2="218" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>

  <text x="200" y="200" font-family="system-ui,sans-serif" font-size="11" fill="white" text-anchor="middle" font-weight="600">${Math.round(score / 10)}</text>
  <text x="200" y="214" font-family="system-ui,sans-serif" font-size="9" fill="rgba(255,255,255,0.35)" text-anchor="middle">LEVEL</text>

  <text x="320" y="200" font-family="system-ui,sans-serif" font-size="11" fill="white" text-anchor="middle" font-weight="600">${new Date().getFullYear()}</text>
  <text x="320" y="214" font-family="system-ui,sans-serif" font-size="9" fill="rgba(255,255,255,0.35)" text-anchor="middle">SINCE</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Content-Disposition": 'attachment; filename="collector-dna-card.svg"',
      "Cache-Control": "private, no-cache",
    },
  });
}
