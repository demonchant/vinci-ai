import { motion } from "framer-motion";
import { DNAThread } from "@/components/marketing/DNAThread";
import type { LegacyNarrativeSection } from "@/types/legacy";

export function LegacyStory({ sections }: { sections: LegacyNarrativeSection[] }) {
  return (
    <div className="relative pl-8">
      <DNAThread
        variant="spine"
        className="pointer-events-none absolute left-2 top-0 bottom-0 w-5 opacity-30"
      />
      <div className="space-y-10">
        {sections.map((section, i) => (
          <motion.div
            key={section.heading}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="relative"
          >
            <span className="absolute -left-8 top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
            <h3 className="font-display text-xl text-gradient">{section.heading}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">{section.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
