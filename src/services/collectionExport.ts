import { prisma } from "@/lib/prisma";

async function getExportableItems(userId: string) {
  return prisma.collectible.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function exportAsCSV(userId: string): Promise<string> {
  const items = await getExportableItems(userId);
  const headers = [
    "title",
    "category",
    "status",
    "brand",
    "franchise",
    "year",
    "condition",
    "gradingCompany",
    "grade",
    "purchasePrice",
    "estimatedValue",
  ];
  const rows = items.map((i) =>
    headers
      .map((h) => {
        const value = (i as any)[h];
        return value === null || value === undefined ? "" : String(value).replace(/,/g, ";");
      })
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export async function exportAsJSON(userId: string): Promise<string> {
  const items = await getExportableItems(userId);
  return JSON.stringify(items, null, 2);
}

/** "Museum-style catalog" — a readable Markdown document, one section per item. */
export async function exportAsMarkdownCatalog(userId: string): Promise<string> {
  const items = await getExportableItems(userId);
  let md = `# Collection Catalog\n\nGenerated ${new Date().toLocaleDateString()} · ${items.length} items\n\n`;
  for (const item of items) {
    md += `## ${item.title}\n\n`;
    md += `- **Category**: ${item.category}\n`;
    if (item.year) md += `- **Year**: ${item.year}\n`;
    if (item.brand) md += `- **Brand**: ${item.brand}\n`;
    if (item.condition) md += `- **Condition**: ${item.condition}\n`;
    if (item.gradingCompany) md += `- **Grading**: ${item.gradingCompany} ${item.grade ?? ""}\n`;
    if (item.estimatedValue) md += `- **Estimated Value**: $${item.estimatedValue}\n`;
    md += `- **Status**: ${item.status}\n\n`;
  }
  return md;
}
