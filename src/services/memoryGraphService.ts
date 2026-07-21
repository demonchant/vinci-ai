import { categorizeMemoryKey } from "./memoryService";
import type { CollectorMemoryFact } from "@/types/memory";

export interface GraphNode {
  id: string;
  type: "category" | "memory" | "goal";
  label: string;
  data?: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: "learned from" | "belongs to" | "supports";
}

export function buildMemoryGraph(
  facts: CollectorMemoryFact[],
  goals: { id: string; title: string }[]
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const categorySeen = new Set<string>();

  for (const fact of facts) {
    const category = categorizeMemoryKey(fact.key);
    const categoryId = `category-${category}`;
    if (!categorySeen.has(categoryId)) {
      nodes.push({ id: categoryId, type: "category", label: category });
      categorySeen.add(categoryId);
    }

    const memoryId = `memory-${fact.id}`;
    nodes.push({
      id: memoryId,
      type: "memory",
      label: fact.label,
      data: { confidence: fact.confidence, value: fact.value },
    });
    edges.push({
      id: `${memoryId}-${categoryId}`,
      source: memoryId,
      target: categoryId,
      label: "belongs to",
    });
  }

  for (const goal of goals) {
    const goalId = `goal-${goal.id}`;
    nodes.push({ id: goalId, type: "goal", label: goal.title });
    // Heuristic link: a goal "supports from" any memory whose value appears in the goal title.
    for (const fact of facts) {
      const valueText = String(fact.value).toLowerCase().slice(0, 12);
      if (valueText.length > 3 && goal.title.toLowerCase().includes(valueText)) {
        edges.push({
          id: `memory-${fact.id}-${goalId}`,
          source: `memory-${fact.id}`,
          target: goalId,
          label: "supports",
        });
      }
    }
  }

  return { nodes, edges };
}
