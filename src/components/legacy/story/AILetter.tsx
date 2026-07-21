import { motion } from "framer-motion";

export function AILetter({ letter }: { letter: string }) {
  const paragraphs = letter.split("\n\n").filter(Boolean);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-strong rounded-3xl border border-white/5 p-8"
    >
      <p className="mb-6 text-xs uppercase tracking-[0.25em] text-gray-500">
        A Letter from Vinci AI
      </p>
      <div className="space-y-4">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className={`text-sm leading-relaxed ${
              i === 0 || i === paragraphs.length - 1
                ? "font-medium text-gray-300"
                : "text-gray-400"
            }`}
          >
            {para}
          </p>
        ))}
      </div>
    </motion.div>
  );
}
