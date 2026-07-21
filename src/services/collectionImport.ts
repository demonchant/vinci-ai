import { z } from "zod";
import { createCollectible } from "./collectibleService";

const importRowSchema = z.object({
  title: z.string().min(1),
  category: z.enum([
    "TRADING_CARD",
    "SPORTS_CARD",
    "COMIC",
    "WATCH",
    "SNEAKER",
    "COIN",
    "NFT",
    "FIGURE",
    "MEMORABILIA",
    "OTHER",
  ]),
  brand: z.string().optional(),
  franchise: z.string().optional(),
  year: z.coerce.number().optional(),
  condition: z.string().optional(),
  gradingCompany: z.string().optional(),
  grade: z.string().optional(),
  purchasePrice: z.coerce.number().optional(),
  estimatedValue: z.coerce.number().optional(),
  notes: z.string().optional(),
});

export type ImportRow = z.infer<typeof importRowSchema>;

export interface ImportPreviewResult {
  validRows: ImportRow[];
  invalidRows: { row: number; data: unknown; errors: string[] }[];
}

/** Parses a simple CSV (header row + comma-separated values, no quoted-comma support yet). */
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  const headers = lines[0]!.split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h] = values[i] ?? ""));
    return row;
  });
}

export function previewImport(content: string, format: "csv" | "json"): ImportPreviewResult {
  const rawRows: unknown[] = format === "csv" ? parseCSV(content) : JSON.parse(content);

  const validRows: ImportRow[] = [];
  const invalidRows: ImportPreviewResult["invalidRows"] = [];

  rawRows.forEach((row, i) => {
    const result = importRowSchema.safeParse(row);
    if (result.success) {
      validRows.push(result.data);
    } else {
      invalidRows.push({
        row: i + 1,
        data: row,
        errors: result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
      });
    }
  });

  return { validRows, invalidRows };
}

/** Commits a previously-previewed set of valid rows as real collectibles. */
export async function commitImport(userId: string, rows: ImportRow[]) {
  let created = 0;
  for (const row of rows) {
    await createCollectible(userId, row);
    created++;
  }
  return created;
}
