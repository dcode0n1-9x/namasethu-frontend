import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Amberstone — India's Real Estate Operating System | Verified Direct Homes",
    template: "%s · Amberstone",
  },
  description:
    "Every home on Amberstone is owner-listed, inspected on-site by a civil engineer, authenticated with 3D digital twins, and title-checked against state land records. Zero brokerage, verified trust.",
  keywords: "Amberstone, real estate operating system, verified property, zero brokerage, owner listed homes, civil engineer inspection, 3D digital twin, Bengaluru apartments, Mumbai luxury homes",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  openGraph: {
    title: "Amberstone — India's Real Estate Operating System",
    description: "Verified homes directly from owners with 3D digital twins and cadastral deed authentication.",
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
        {children}
      </body>
    </html>
  );
}
