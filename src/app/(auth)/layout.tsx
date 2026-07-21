import Link from "next/link";
import { DNAThread } from "@/components/marketing/DNAThread";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background bg-vinci-glow p-6">
      <DNAThread
        variant="ambient"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 h-[260px] w-full -translate-y-1/2 opacity-30"
      />

      <div className="relative z-10 w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 flex justify-center text-lg font-semibold tracking-tight"
        >
          Vinci <span className="text-gradient">AI</span>
        </Link>
        <div className="glass-strong rounded-2xl p-8">{children}</div>
      </div>
    </div>
  );
}
