import Link from "next/link";
import { COLLECTIBLE_CATEGORY_LABELS } from "@/types/common";
import { formatCurrency } from "@/lib/utils";
import type { Collectible } from "@/types/collectible";

const COLUMNS = ["Title", "Category", "Year", "Condition", "Grading", "Purchase", "Value", "Status"];

export function TableView({ items }: { items: Collectible[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/5">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/5 text-xs text-gray-500">
            {COLUMNS.map((c) => (
              <th key={c} className="px-4 py-2.5 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-white/[0.02]">
              <td className="px-4 py-2.5">
                <Link href={`/collection/${item.id}`} className="font-medium hover:text-accent">
                  {item.title}
                </Link>
              </td>
              <td className="px-4 py-2.5 text-gray-400">{COLLECTIBLE_CATEGORY_LABELS[item.category]}</td>
              <td className="px-4 py-2.5 text-gray-400">{item.year ?? "—"}</td>
              <td className="px-4 py-2.5 text-gray-400">{item.condition ?? "—"}</td>
              <td className="px-4 py-2.5 text-gray-400">
                {item.gradingCompany ? `${item.gradingCompany} ${item.grade ?? ""}` : "—"}
              </td>
              <td className="px-4 py-2.5 text-gray-400">
                {item.purchasePrice !== null ? formatCurrency(item.purchasePrice) : "—"}
              </td>
              <td className="px-4 py-2.5 text-gray-200">
                {item.estimatedValue !== null ? formatCurrency(item.estimatedValue) : "—"}
              </td>
              <td className="px-4 py-2.5 text-gray-400">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
