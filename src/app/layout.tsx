import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Namasthetu — Verified homes, direct from owners",
    template: "%s · Namasthetu",
  },
  description:
    "Every home on Namasthetu is owner-listed, inspected on-site by a civil engineer, and title-checked against state land records. No brokers, no fake listings.",
  keywords: "verified property, zero brokerage, owner listed homes, home inspection, 3D home tour, Bengaluru apartments, Mumbai apartments",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-white font-sans text-ink antialiased selection:bg-brand-soft selection:text-brand-hover">
        {children}
      </body>
    </html>
  );
}
