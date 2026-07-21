import type { LegacyReportData } from "@/types/legacy";

export function exportAsMarkdown(data: LegacyReportData): string {
  const { cover, executiveSummary, story, collectionHighlights, legacyScore, aiLetter, nextChapter, achievements, portfolio } = data;

  let md = `# AI Collector Legacy Report™\n\n`;
  md += `**Collector:** ${cover.collectorName}  \n`;
  md += `**Level:** ${cover.level} · **Archetype:** ${cover.primaryArchetype}  \n`;
  md += `**DNA Score:** ${cover.dnaScore} · **Legacy Score:** ${legacyScore.overall}  \n`;
  md += `**Generated:** ${new Date(cover.generatedAt).toLocaleDateString()}  \n\n---\n\n`;
  md += `## Executive Summary\n\n${executiveSummary}\n\n`;
  md += `## The Collector's Story\n\n`;
  for (const s of story) md += `### ${s.heading}\n\n${s.body}\n\n`;
  md += `## Collection Highlights\n\n`;
  for (const h of collectionHighlights) md += `- **${h.label}:** ${h.collectibleTitle} — ${h.value}\n`;
  md += `\n## Portfolio\n\n`;
  md += `- Total Items: ${portfolio.totalItems}\n`;
  md += `- Portfolio Value: ${portfolio.totalValue > 0 ? `$${portfolio.totalValue.toLocaleString()}` : "Not available"}\n`;
  md += `- Authentication Rate: ${portfolio.authenticationRatePct}%\n`;
  md += `- Diversification Score: ${portfolio.diversificationScore}\n\n`;
  md += `## Achievements\n\n`;
  for (const a of achievements.filter((a) => a.isUnlocked)) md += `- **${a.title}** (${a.tier}, ${a.xp} XP)\n`;
  md += `\n## Legacy Score\n\n`;
  for (const b of legacyScore.breakdown) md += `- ${b.label}: ${b.score}\n`;
  md += `\n**Overall: ${legacyScore.overall}**\n${legacyScore.explanation}\n\n`;
  md += `## Next Chapter\n\n`;
  for (const r of nextChapter) md += `- ${r}\n`;
  md += `\n---\n\n${aiLetter}\n`;
  return md;
}

export function exportAsJSON(data: LegacyReportData): string {
  return JSON.stringify(data, null, 2);
}

export function exportAsSVGCover(data: LegacyReportData): string {
  const { cover, legacyScore } = data;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A0A0F"/>
      <stop offset="100%" stop-color="#111118"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6D5DFB"/>
      <stop offset="100%" stop-color="#00D4FF"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" rx="24" fill="url(#bg)"/>
  <rect width="800" height="500" rx="24" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <rect x="0" y="0" width="800" height="4" fill="url(#accent)"/>
  <text x="48" y="62" font-family="Georgia,serif" font-size="13" font-weight="600" fill="#6D5DFB" letter-spacing="3">VINCI AI</text>
  <text x="48" y="80" font-family="system-ui,sans-serif" font-size="10" fill="rgba(255,255,255,0.3)" letter-spacing="2">AI COLLECTOR LEGACY REPORT</text>
  <text x="400" y="165" font-family="Georgia,serif" font-size="44" font-weight="700" fill="white" text-anchor="middle">${cover.collectorName}</text>
  <text x="400" y="192" font-family="system-ui,sans-serif" font-size="13" fill="rgba(255,255,255,0.4)" text-anchor="middle" letter-spacing="2">COLLECTOR SINCE ${new Date(cover.collectorSince).getFullYear()}</text>
  <text x="200" y="275" font-family="Georgia,serif" font-size="64" font-weight="700" fill="white" text-anchor="middle">${cover.dnaScore}</text>
  <text x="200" y="300" font-family="system-ui,sans-serif" font-size="10" fill="rgba(255,255,255,0.35)" text-anchor="middle" letter-spacing="3">COLLECTOR DNA</text>
  <line x1="380" y1="245" x2="380" y2="315" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <text x="600" y="275" font-family="Georgia,serif" font-size="64" font-weight="700" fill="url(#accent)" text-anchor="middle">${legacyScore.overall}</text>
  <text x="600" y="300" font-family="system-ui,sans-serif" font-size="10" fill="rgba(255,255,255,0.35)" text-anchor="middle" letter-spacing="3">LEGACY SCORE</text>
  <text x="400" y="365" font-family="system-ui,sans-serif" font-size="18" font-weight="600" fill="#00D4FF" text-anchor="middle">${cover.primaryArchetype}</text>
  <text x="400" y="388" font-family="system-ui,sans-serif" font-size="12" fill="rgba(255,255,255,0.3)" text-anchor="middle">Level ${cover.level} · ${cover.collectionSize} collectibles</text>
  <text x="400" y="462" font-family="system-ui,sans-serif" font-size="10" fill="rgba(255,255,255,0.2)" text-anchor="middle">${new Date(cover.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</text>
</svg>`;
}
