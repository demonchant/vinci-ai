"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import type { CollectorMemoryFact } from "@/types/memory";

export function MemoryEditDialog({
  fact,
  open,
  onOpenChange,
  onSave,
}: {
  fact: CollectorMemoryFact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (value: string) => void;
}) {
  const [value, setValue] = useState(fact ? String(fact.value) : "");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl glass-strong p-6 shadow-glass">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-sm font-medium">Correct memory</Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-gray-300">
              <Icon icon={X} size="button" />
            </Dialog.Close>
          </div>
          <p className="mt-1 text-xs text-gray-500">{fact?.label}</p>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-4 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-primary"
            autoFocus
          />
          <p className="mt-2 text-xs text-gray-500">
            Correcting a memory marks it verified and locks in 100% confidence.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close className="rounded-xl px-4 py-2 text-sm text-gray-400 hover:bg-white/5">
              Cancel
            </Dialog.Close>
            <button
              onClick={() => {
                onSave(value);
                onOpenChange(false);
              }}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-glow"
            >
              Save
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
