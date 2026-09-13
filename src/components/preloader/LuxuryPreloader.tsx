"use client";

import React, { useEffect, useRef, useState } from "react";
import "./luxury-preloader.css";

interface LuxuryPreloaderProps {
  duration?: number;
  forceShow?: boolean;
}

export const LuxuryPreloader: React.FC<LuxuryPreloaderProps> = ({
  duration = 1600,
  forceShow = false,
}) => {
  const [phase, setPhase] = useState<"idle" | "counting" | "fadeUi" | "revealed" | "done">("idle");
  const [count, setCount] = useState<number>(0);
  const [targetCoord, setTargetCoord] = useState<{
    top: number | string;
    left: number | string;
    width: number;
    height: number;
  } | null>(null);

  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const isBrowser = typeof window !== "undefined";
    const searchParams = isBrowser ? new URLSearchParams(window.location.search) : null;
    const isForced = forceShow || (searchParams?.get("intro") === "1") || (searchParams?.get("preview") === "1");
    
    let hasSeen = false;
    try {
      hasSeen = isBrowser && window.sessionStorage.getItem("lux_intro_seen") === "true";
    } catch {
      // ignore storage access error in strict mode
    }

    const prefersReducedMotion = isBrowser && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Helper to reveal hero targets immediately if skipping
    const revealHeroTargets = () => {
      document.querySelectorAll(".lux-hero-target").forEach((el) => {
        el.classList.add("revealed");
      });
    };

    if ((!isForced && hasSeen) || prefersReducedMotion) {
      revealHeroTargets();
      document.documentElement.classList.remove("lux-active");
      document.body.style.overflow = "";
      setPhase("done");
      return;
    }

    // Active preloader sequence begins
    document.documentElement.classList.add("lux-active");
    document.body.style.overflow = "hidden";
    setPhase("counting");

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Eased counter ramp-up (fast start with luxury deceleration)
      const easedProgress = Math.pow(progress, 1.25);
      const currentVal = Math.floor(easedProgress * 100);
      setCount(currentVal);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(100);
        // Phase 1: Fade out UI labels, counter, progress line
        setPhase("fadeUi");

        const t1 = setTimeout(() => {
          // Measure destination logo mark in header with sub-pixel precision
          const targetEl = document.getElementById("header-brand-logo-mark");
          if (targetEl) {
            // Target the actual SVG inside the mark container for exact sizing and alignment
            const svgEl = targetEl.querySelector("svg") || targetEl;
            const rect = svgEl.getBoundingClientRect();
            setTargetCoord({
              top: rect.top + rect.height / 2,
              left: rect.left + rect.width / 2,
              width: rect.width || 24,
              height: rect.height || 24,
            });
          } else {
            // Fallback coordinate matching default header layout
            setTargetCoord({
              top: 40,
              left: 48,
              width: 24,
              height: 24,
            });
          }

          // Phase 2: Part the split curtains outward & fly logo to header
          setPhase("revealed");

          // Trigger hero ingress reveals on page
          revealHeroTargets();

          const t2 = setTimeout(() => {
            // Phase 3: Animation complete, unlock scroll, persist session seen
            document.documentElement.classList.remove("lux-active");
            document.body.style.overflow = "";
            setPhase("done");
            try {
              window.sessionStorage.setItem("lux_intro_seen", "true");
            } catch {
              // ignore private mode storage errors
            }
          }, 1450); // Matches curtain split & flight duration

          timerRef.current.push(t2);
        }, 280);

        timerRef.current.push(t1);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    // Keep destination coordinate updated on resize
    const handleResize = () => {
      const targetEl = document.getElementById("header-brand-logo-mark");
      if (targetEl) {
        const svgEl = targetEl.querySelector("svg") || targetEl;
        const rect = svgEl.getBoundingClientRect();
        setTargetCoord({
          top: rect.top + rect.height / 2,
          left: rect.left + rect.width / 2,
          width: rect.width || 24,
          height: rect.height || 24,
        });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      timerRef.current.forEach(clearTimeout);
      window.removeEventListener("resize", handleResize);
      document.documentElement.classList.remove("lux-active");
      document.body.style.overflow = "";
    };
  }, [duration, forceShow]);

  if (phase === "idle" || phase === "done") {
    return null;
  }

  const isFadeUi = phase === "fadeUi" || phase === "revealed";
  const isRevealed = phase === "revealed";

  // Center logo style vs settled header style
  const logoStyle: React.CSSProperties = isRevealed && targetCoord
    ? {
        top: typeof targetCoord.top === "number" ? `${targetCoord.top}px` : targetCoord.top,
        left: typeof targetCoord.left === "number" ? `${targetCoord.left}px` : targetCoord.left,
        width: `${targetCoord.width}px`,
        height: `${targetCoord.height}px`,
        transform: "translate(-50%, -50%)",
      }
    : {
        top: "50%",
        left: "50%",
        width: "76px",
        height: "69px",
        transform: "translate(-50%, -50%)",
      };

  return (
    <>
      {/* 1. PERSISTENT ARCHITECTURAL BACKGROUND GRID */}
      <div className="lux-grid" aria-hidden="true">
        <div className="lux-grid-col" />
        <div className="lux-grid-col" />
        <div className="lux-grid-col" />
        <div className="lux-grid-col" />
        <div className="lux-grid-col" />
      </div>

      {/* 2. SPLIT-CURTAIN PRELOADER OVERLAY */}
      <div
        id="lux-preloader"
        role="status"
        aria-live="polite"
        aria-busy={!isRevealed}
        className={`${isFadeUi ? "fade-ui" : ""} ${isRevealed ? "curtains-open" : ""}`}
      >
        {/* Left & Right Curtains */}
        <div className="lux-curtain lux-curtain-left" />
        <div className="lux-curtain lux-curtain-right" />

        {/* Preloader UI Layer */}
        <div className="lux-preloader-ui">
          {/* Top Bar: Corridors & Escrow Telemetry */}
          <div className="lux-ui-top">
            <span>DUBAI PRIME FREEHOLD &bull; INDIAN METROS</span>
            <span>AMBERSTONE ESCROW OS &bull; CADASTRAL ATTESTATION</span>
          </div>

          {/* Center Brand Identity Intro */}
          <div className="lux-ui-center">
            <h2 className="lux-ui-center-title">AMBER STONE</h2>
            <p className="lux-ui-center-sub">REAL ESTATE OPERATING SYSTEM</p>
            <div className="mt-3 flex items-center justify-center opacity-85">
              <img
                src="/brand/amberstone-tagline-dark-web.png"
                alt="Where trust finds an address"
                className="h-3 w-auto object-contain"
              />
            </div>
          </div>

          {/* Bottom Bar: Slogan & Tabular Counter */}
          <div className="lux-ui-bottom">
            <p className="lux-slogan">Price. Carry. Rent. Exit.</p>
            <span className="lux-counter" id="luxCounter">
              {count.toString().padStart(3, "0")}
            </span>
          </div>

          {/* Precision Warm Amber Progress Line */}
          <div className="lux-progress-track">
            <div
              className="lux-progress-bar"
              id="luxProgressBar"
              style={{ width: `${count}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. SHARED FLIGHT LOGO (FLIP Migration from screen center to header) */}
      <div
        className={`lux-flight-logo ${isRevealed ? "settled" : ""}`}
        id="luxFlightLogo"
        style={logoStyle}
        aria-label="Amberstone Monogram Mark"
      >
        <svg
          className="lux-logo-svg"
          viewBox="0 0 2333 2122"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Official Amberstone Geometric Monogram A */}
          <path
            d="M631 1086L890 1538L552 2121H1L631 1086Z"
            fill="#1A1A1A"
          />
          <path
            d="M1084 1L2330 2121H1765L1392 1505H1005L1231 1101L810 388L1084 1Z"
            fill="#1A1A1A"
          />
        </svg>
      </div>
    </>
  );
};
