"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const TextField = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { error?: string }
>(function TextField({ className, error, ...props }, ref) {
  return (
    <div>
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl bg-white/5 border px-4 py-2.5 text-sm outline-none transition",
          error ? "border-red-400/60 focus:border-red-400" : "border-white/10 focus:border-primary",
          className
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
});
