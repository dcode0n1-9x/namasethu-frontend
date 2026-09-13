import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { LuxuryPreloader } from "@/components/preloader/LuxuryPreloader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Amberstone — Luxury Real Estate Operating System | Dubai Prime & Indian Metros",
    template: "%s · Amberstone",
  },
  description:
    "Institutional-grade real estate operating system bridging Dubai Prime Freehold nodes and Indian Metros. 80-point civil inspection, cryptographic DLD title deed verification, Kaveri 2.0 land record indexing, and nodal escrow assurance.",
  keywords: "Amberstone, real estate operating system, verified property, zero brokerage, owner listed homes, civil engineer inspection, 3D digital twin, Bengaluru apartments, Mumbai luxury homes, Dubai prime freehold, DLD title verification",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  openGraph: {
    title: "Amberstone — Luxury Real Estate Operating System",
    description: "Where trust finds an address. Verified homes directly from owners with 3D digital twins and cadastral deed authentication.",
    siteName: "Amberstone",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-white font-sans text-ink antialiased selection:bg-amber-100 selection:text-amber-900">
        <CurrencyProvider>
          <LoadingProvider>
            <LuxuryPreloader />
            {children}
          </LoadingProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
