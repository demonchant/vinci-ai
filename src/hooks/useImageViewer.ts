"use client";

import { useCallback, useState } from "react";

export function useImageViewer() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(4, z + 0.25)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(0.5, z - 0.25)), []);
  const fit = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);
  const actualSize = useCallback(() => setZoom(1), []);
  const rotate = useCallback(() => setRotation((r) => (r + 90) % 360), []);
  const flip = useCallback(() => setFlipped((f) => !f), []);

  return { zoom, pan, setPan, rotation, flipped, zoomIn, zoomOut, fit, actualSize, rotate, flip };
}
