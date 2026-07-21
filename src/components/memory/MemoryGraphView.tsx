"use client";

import { useMemo, useState, useCallback } from "react";
import ReactFlow, { Background, Controls, type Node, type Edge, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import type { GraphNode, GraphEdge } from "@/services/memoryGraphService";

const TYPE_COLOR: Record<GraphNode["type"], string> = {
  category: "#00D4FF",
  memory: "#6D5DFB",
  goal: "#22C55E",
};

function layout(nodes: GraphNode[]): Node[] {
  const byType: Record<string, GraphNode[]> = { category: [], memory: [], goal: [] };
  for (const n of nodes) byType[n.type]!.push(n);

  const columns = { category: 0, memory: 320, goal: 640 };
  const result: Node[] = [];

  (["category", "memory", "goal"] as const).forEach((type) => {
    byType[type]!.forEach((n, i) => {
      result.push({
        id: n.id,
        position: { x: columns[type], y: i * 90 },
        data: { label: n.label },
        style: {
          background: "rgba(17,17,19,0.9)",
          border: `1px solid ${TYPE_COLOR[n.type]}55`,
          color: "#fff",
          borderRadius: 12,
          fontSize: 12,
          padding: 8,
          width: 200,
        },
      });
    });
  });
  return result;
}

export function MemoryGraphView({ nodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const flowNodes = useMemo(() => layout(nodes), [nodes]);
  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: highlighted === e.source || highlighted === e.target,
        style: { stroke: highlighted ? "#6D5DFB" : "rgba(255,255,255,0.15)" },
        labelStyle: { fill: "#71717A", fontSize: 10 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(255,255,255,0.3)" },
      })),
    [edges, highlighted]
  );

  const onNodeMouseEnter = useCallback((_: unknown, node: Node) => setHighlighted(node.id), []);
  const onNodeMouseLeave = useCallback(() => setHighlighted(null), []);

  if (nodes.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Your knowledge graph fills in as Vinci AI learns more about you.
      </p>
    );
  }

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-2xl border border-white/5">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#27272a" gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
