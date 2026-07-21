"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn, ZoomOut, Maximize, RotateCcw, FlipHorizontal } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { useImageViewer } from "@/hooks/useImageViewer";

export function ImageViewer({ imageUrl, alt }: { imageUrl: string | null; alt: string }) {
  const { zoom, rotation, flipped, zoomIn, zoomOut, fit, rotate, flip } = useImageViewer();
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!imageUrl) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-600">
        Select or upload an image to view it here.
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-full flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}
    >
      <div className="flex-1 overflow-hidden">
        <div
          className="flex h-full w-full items-center justify-center transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg) scaleX(${flipped ? -1 : 1})`,
          }}
        >
          <div className="relative h-[80%] w-[80%]">
            <Image src={imageUrl} alt={alt} fill className="object-contain" unoptimized />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 border-t border-white/5 p-2">
        <ViewerButton icon={ZoomOut} onClick={zoomOut} label="Zoom out" />
        <span className="w-12 text-center text-xs text-gray-500">{Math.round(zoom * 100)}%</span>
        <ViewerButton icon={ZoomIn} onClick={zoomIn} label="Zoom in" />
        <ViewerButton icon={Maximize} onClick={fit} label="Fit to screen" />
        <ViewerButton icon={RotateCcw} onClick={rotate} label="Rotate" />
        <ViewerButton icon={FlipHorizontal} onClick={flip} label="Flip" />
        <ViewerButton
          icon={Maximize}
          onClick={() => setIsFullscreen((f) => !f)}
          label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        />
      </div>
    </div>
  );
}

function ViewerButton({
  icon,
  onClick,
  label,
}: {
  icon: typeof ZoomIn;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
    >
      <Icon icon={icon} size="button" decorative />
    </button>
  );
}
