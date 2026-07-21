"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MagneticButton({
  children,
  className,
  href,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  function handleMove(e: React.MouseEvent) {
    if (prefersReduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    setOffset({ x, y });
  }

  const classes = cn(
    "relative inline-flex items-center justify-center rounded-xl px-7 py-3.5 text-sm font-medium transition-colors",
    variant === "primary"
      ? "bg-primary text-white shadow-glow hover:bg-primary/90"
      : "border border-white/15 text-white hover:bg-white/5",
    className
  );

  const inner = (
    <motion.span
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.3 }}
      className={classes}
    >
      {children}
    </motion.span>
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      className="inline-block"
    >
      {href ? (
        <Link href={href} onClick={onClick}>
          {inner}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className="block">
          {inner}
        </button>
      )}
    </div>
  );
}
