"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export const PasswordInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { error?: string }
>(function PasswordInput({ className, error, ...props }, ref) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="relative">
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(
            "w-full rounded-xl bg-white/5 border px-4 py-2.5 pr-11 text-sm outline-none transition",
            error ? "border-red-400/60 focus:border-red-400" : "border-white/10 focus:border-primary",
            className
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-300"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
});
