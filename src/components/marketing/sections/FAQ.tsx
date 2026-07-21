"use client";

import { useState } from "react";
import { ChevronDown } from "@/components/ui/icons";
import { Reveal } from "../Reveal";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "What is Collector DNA?",
    a: "A profile computed from your real activity — what you buy, how long you hold items, how much you research before purchasing. It assigns a primary and secondary collector archetype (like Investor or Historian) and updates as you use Vinci AI.",
  },
  {
    q: "How does Collector Memory work?",
    a: "When you chat, search, or add collectibles, Vinci AI extracts durable preferences — your budget, favorite categories, preferred grading company — and stores them as editable facts. Every future answer can use them, but only the facts you choose to keep.",
  },
  {
    q: "Is my data private?",
    a: "Your data is protected by row-level security in the database — only you can read or write your own records, even on the backend. You can edit, pin, archive, or fully reset your Collector Memory at any time from the Memory page.",
  },
  {
    q: "How accurate are AI insights?",
    a: "Every value, rarity, or authenticity statement is an AI estimate, not a professional appraisal — and we say so explicitly wherever it appears. Confidence scores are shown so you can judge how much weight to give any single analysis.",
  },
  {
    q: "Can I export my reports?",
    a: "Yes — the Collector Legacy Report can be exported as a PDF, an interactive HTML page, or a shareable social card once it's built out.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="container py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">FAQ</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Questions, answered</h2>
      </Reveal>

      <Reveal className="mx-auto mt-14 max-w-2xl divide-y divide-white/5">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.q}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between py-5 text-left"
              >
                <span className="font-medium">{item.q}</span>
                <ChevronDown
                  className={cn("h-4 w-4 shrink-0 text-gray-500 transition-transform", isOpen && "rotate-180")}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  isOpen ? "max-h-40 pb-5" : "max-h-0"
                )}
              >
                <p className="text-sm text-gray-400">{item.a}</p>
              </div>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
