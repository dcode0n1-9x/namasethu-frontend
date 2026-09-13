import { describe, expect, it } from "bun:test";
import fs from "fs";
import path from "path";

describe("Amber Stone Master Brand Assets & Placement Integrity", () => {
  const FRONTEND_PUBLIC = path.resolve(__dirname, "../../public");
  const ADMIN_PUBLIC = path.resolve(__dirname, "../../../namasethu-admin/public");

  const REQUIRED_BRAND_ASSETS = [
    "amberstone-mark.svg",
    "amberstone-stacked-dark.png",
    "amberstone-stacked-light.png",
    "amberstone-lockup-dark.png",
    "amberstone-lockup-light.png",
    "amberstone-wordmark-dark.png",
    "amberstone-wordmark-light.png",
    "amberstone-tagline-dark.png",
    "amberstone-tagline-light.png",
    "amberstone-mark-charcoal.png",
    "amberstone-mark-white.png",
    "amberstone-mark-black.png",
    "amberstone-mark-silver.png",
    "amberstone-stacked-dark-web.png",
    "amberstone-lockup-dark-web.png",
    "amberstone-mark-dark-web.png",
    "amberstone-mark-light-web.png",
  ];

  const REQUIRED_FAVICONS = [
    "favicon.ico",
    "favicon-16.png",
    "favicon-16x16.png",
    "favicon-32.png",
    "favicon-32x32.png",
    "favicon-64.png",
    "favicon-128.png",
    "favicon-256.png",
    "favicon-512.png",
    "apple-touch-icon.png",
  ];

  it("should deploy all master brand PNGs and web-optimized variants to frontend", () => {
    for (const asset of REQUIRED_BRAND_ASSETS) {
      const p = path.join(FRONTEND_PUBLIC, "brand", asset);
      expect(fs.existsSync(p)).toBe(true);
      const stat = fs.statSync(p);
      expect(stat.size).toBeGreaterThan(100);
    }
  });

  it("should deploy all master brand assets to admin clearinghouse console", () => {
    for (const asset of REQUIRED_BRAND_ASSETS) {
      const p = path.join(ADMIN_PUBLIC, "brand", asset);
      expect(fs.existsSync(p)).toBe(true);
      const stat = fs.statSync(p);
      expect(stat.size).toBeGreaterThan(100);
    }
  });

  it("should deploy official Amberstone favicons across resolutions in both repos", () => {
    for (const fav of REQUIRED_FAVICONS) {
      const fPath = path.join(FRONTEND_PUBLIC, fav);
      const aPath = path.join(ADMIN_PUBLIC, fav);
      expect(fs.existsSync(fPath)).toBe(true);
      expect(fs.existsSync(aPath)).toBe(true);
      expect(fs.statSync(fPath).size).toBeGreaterThan(50);
      expect(fs.statSync(aPath).size).toBeGreaterThan(50);
    }
  });

  it("should contain clean SVG vector path with exact geometric bifurcation for the A monogram", () => {
    const svgPath = path.join(FRONTEND_PUBLIC, "brand", "amberstone-mark.svg");
    const svgContent = fs.readFileSync(svgPath, "utf8");
    expect(svgContent).toContain("<svg");
    expect(svgContent).toContain("viewBox=\"0 0 2333 2122\"");
    // Verifies the two distinct geometric paths: Left Form and Right Form
    expect(svgContent).toContain("M631 1086L890 1538L552 2121H1L631 1086Z");
    expect(svgContent).toContain("M1084 1L2330 2121H1765L1392 1505H1005L1231 1101L810 388L1084 1Z");
  });
});

describe("Luxury Preloader Mathematics, Timing & Color Calibration", () => {
  it("should calculate progressive non-linear counter ramp according to luxury deceleration curve", () => {
    const computeCount = (progress: number) => {
      const clamped = Math.min(Math.max(progress, 0), 1);
      const eased = Math.pow(clamped, 1.25);
      return Math.floor(eased * 100);
    };

    expect(computeCount(0)).toBe(0);
    expect(computeCount(0.25)).toBe(17);
    expect(computeCount(0.5)).toBe(42);
    expect(computeCount(0.75)).toBe(69);
    expect(computeCount(1.0)).toBe(100);
  });

  it("should format tabular counter digits with 3 leading zeros to prevent horizontal layout jank", () => {
    const formatTabular = (num: number) => num.toString().padStart(3, "0");

    expect(formatTabular(0)).toBe("000");
    expect(formatTabular(1)).toBe("001");
    expect(formatTabular(42)).toBe("042");
    expect(formatTabular(99)).toBe("099");
    expect(formatTabular(100)).toBe("100");
  });

  it("should uphold authentic Brand Kit color specifications in preloader stylesheet", () => {
    const cssPath = path.resolve(__dirname, "../components/preloader/luxury-preloader.css");
    const cssContent = fs.readFileSync(cssPath, "utf8");

    // Stone White Ivory Curtain Surface (#f8f7f4 / #F6F5F2)
    expect(cssContent).toContain("--lux-bg: #f8f7f4");
    // Deep Charcoal Black text (#1A1A1A)
    expect(cssContent).toContain("--lux-text: #1a1a1a");
    // Warm Amber Brand Signature (#B3834D)
    expect(cssContent).toContain("--lux-amber: #b3834d");
    // Architectural 5-column grid
    expect(cssContent).toContain("grid-template-columns: repeat(5, 1fr)");
    // Signature luxury easing bezier
    expect(cssContent).toContain("cubic-bezier(0.77, 0, 0.175, 1)");
    // Zero-reflow scaleX GPU transitions
    expect(cssContent).toContain("transform: scaleX(0)");
    // Closed curtain gold hairline seam
    expect(cssContent).toContain(".lux-curtain-left::after");
    // Synchronization with header logo mark to prevent duplicate logo glitch
    expect(cssContent).toContain("html.lux-active #header-brand-logo-mark svg");
  });

  it("should not render the corridor hero band on the homepage (search leads directly after the header)", () => {
    const pagePath = path.resolve(__dirname, "../app/page.tsx");
    const pageContent = fs.readFileSync(pagePath, "utf8");

    expect(pageContent).not.toContain("Dubai Prime &amp; Indian Metros");
    expect(pageContent).not.toContain("INSTITUTIONAL CORRIDORS");
  });

  it("should utilize authentic master brand assets in SiteFooter and avoid duplicate header mark IDs", () => {
    const footerPath = path.resolve(__dirname, "../components/navigation/SiteFooter.tsx");
    const footerContent = fs.readFileSync(footerPath, "utf8");

    // Must utilize master stacked logo and tagline asset
    expect(footerContent).toContain("BrandLogo variant=\"stacked\"");
    expect(footerContent).toContain("/brand/amberstone-tagline-dark-web.png");
    expect(footerContent).toContain("isHeader={false}");
    // Must contain Replay Brand Intro trigger
    expect(footerContent).toContain("replayIntro");
  });

  it("should accurately measure target SVG and handle instant skip reveals in LuxuryPreloader controller", () => {
    const preloaderPath = path.resolve(__dirname, "../components/preloader/LuxuryPreloader.tsx");
    const preloaderContent = fs.readFileSync(preloaderPath, "utf8");

    // Checks sub-pixel target measuring
    expect(preloaderContent).toContain("targetEl.querySelector(\"svg\")");
    // Checks reveal of all hero targets on skip
    expect(preloaderContent).toContain("revealHeroTargets()");
    // Checks active html class toggle
    expect(preloaderContent).toContain("document.documentElement.classList.add(\"lux-active\")");
    expect(preloaderContent).toContain("document.documentElement.classList.remove(\"lux-active\")");
    // Checks inclusion of master tagline asset in preloader center identity
    expect(preloaderContent).toContain("/brand/amberstone-tagline-dark-web.png");
  });
});
