import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${fraunces.variable} min-h-screen bg-background bg-vinci-glow`}>
      {children}
    </div>
  );
}
