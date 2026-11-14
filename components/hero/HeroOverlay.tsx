"use client";

import React from "react";

interface HeroOverlayProps {
  progress: number;
  prefersReducedMotion?: boolean;
}

/**
 * Calculates transition styles for left-aligned editorial text blocks
 */
function getStageStyle(
  progress: number,
  start: number,
  end: number,
  prefersReducedMotion: boolean
): React.CSSProperties {
  if (prefersReducedMotion) {
    return start >= 0.6
      ? { opacity: 1, transform: "translateY(0)" }
      : { opacity: 0, pointerEvents: "none" };
  }

  const fadeInEnd = start + 0.08;
  const fadeOutStart = end - 0.08;

  let opacity = 0;
  let translateY = 14;

  if (progress >= start && progress <= end) {
    if (progress < fadeInEnd) {
      const t = (progress - start) / (fadeInEnd - start);
      opacity = t;
      translateY = 14 * (1 - t);
    } else if (progress > fadeOutStart && end < 0.98) {
      const t = (progress - fadeOutStart) / (end - fadeOutStart);
      opacity = 1 - t;
      translateY = -14 * t;
    } else {
      opacity = 1;
      translateY = 0;
    }
  }

  return {
    opacity,
    transform: `translate3d(0, ${translateY}px, 0)`,
    transition: "opacity 160ms cubic-bezier(0.16, 1, 0.3, 1), transform 160ms cubic-bezier(0.16, 1, 0.3, 1)",
    pointerEvents: opacity > 0.5 ? "auto" : "none",
  };
}

export function HeroOverlay({
  progress,
  prefersReducedMotion = false,
}: HeroOverlayProps) {
  const cueOpacity = prefersReducedMotion ? 0 : Math.max(0, 1 - progress * 14);

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 md:p-14 pointer-events-none select-none">
      {/* Top Header Bar & Fixed HUD Readout outside the 3D canvas */}
      <header className="w-full flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
          <span className="text-xs sm:text-sm font-mono tracking-[0.25em] text-white/90 uppercase font-semibold">
            LUMEN OPTICS
          </span>
        </div>

        {/* Fixed HUD Readout in the top-right corner, permanently unobscured by the lens */}
        <div className="flex items-center gap-4 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 font-mono text-xs text-white/80">
          <span className="text-amber-400 font-bold">85mm f/1.4</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="text-slate-300">Nano Crystal Coat</span>
          <span className="w-1 h-1 rounded-full bg-white/30 hidden sm:inline" />
          <span className="hidden sm:inline text-slate-400">Ø 77mm</span>
        </div>
      </header>

      {/* Main Editorial Text Section - Positioned on the LEFT (0% - 50% width)
          with a soft dark radial/linear gradient scrim behind it for guaranteed legibility */}
      <div className="relative w-full max-w-7xl mx-auto my-auto min-h-[340px] flex items-center">
        {/* Dark Scrim Container on the left side */}
        <div className="w-full md:w-[52%] lg:w-[48%] relative">
          {/* Soft dark gradient scrim background behind text */}
          <div
            className="absolute -inset-6 -inset-y-10 rounded-3xl bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent blur-xl pointer-events-none -z-10"
            aria-hidden="true"
          />

          {/* Stage 1: 0.0 - 0.33 */}
          <section
            style={getStageStyle(progress, 0.0, 0.33, prefersReducedMotion)}
            className="flex flex-col text-left"
            aria-hidden={progress > 0.33 && !prefersReducedMotion}
          >
            <p className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-amber-400 mb-3 font-semibold">
              Master Series
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.08] drop-shadow-sm">
              Lumen Precision, <br />
              <span className="bg-gradient-to-r from-amber-200 via-white to-slate-300 bg-clip-text text-transparent">
                pure optical truth.
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
              Crafted from monolithic aerospace alloy. Zero chromatic aberration, true color rendition, and edge-to-edge micro-contrast.
            </p>
          </section>

          {/* Stage 2: 0.33 - 0.66 */}
          <section
            style={getStageStyle(progress, 0.33, 0.66, prefersReducedMotion)}
            className="flex flex-col text-left absolute inset-0"
            aria-hidden={(progress < 0.33 || progress > 0.66) && !prefersReducedMotion}
          >
            <p className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-amber-400 mb-3 font-semibold">
              Internal Architecture
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.08] drop-shadow-sm">
              9 Rounded Blades, <br />
              <span className="bg-gradient-to-r from-amber-300 via-yellow-100 to-white bg-clip-text text-transparent">
                flawless bokeh.
              </span>
            </h2>
            <p className="mt-4 max-w-lg text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
              Dual linear ultrasonic focus motors drive 14 elements in 10 groups silently with sub-millimeter precision.
            </p>
          </section>

          {/* Stage 3: 0.66 - 1.00 */}
          <section
            style={getStageStyle(progress, 0.66, 1.0, prefersReducedMotion)}
            className="flex flex-col text-left absolute inset-0"
            aria-hidden={progress < 0.66 && !prefersReducedMotion}
          >
            <p className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-amber-400 mb-3 font-semibold">
              The Standard
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.08] drop-shadow-sm">
              Engineered for <br />
              <span className="bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
                the definitive image.
              </span>
            </h2>
            <p className="mt-4 max-w-lg text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
              Weather-sealed fluorine coating deflects oil, water, and particulate matter in the harshest environments.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 pointer-events-auto">
              <button
                type="button"
                className="px-6 py-3 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-amber-400 text-slate-950 hover:bg-amber-300 active:scale-95 transition-all shadow-[0_4px_24px_rgba(245,158,11,0.3)]"
              >
                Inquire Order
              </button>
              <button
                type="button"
                className="px-6 py-3 rounded-full text-xs font-mono font-semibold tracking-widest uppercase border border-white/20 text-white hover:bg-white/10 active:scale-95 transition-all"
              >
                MTF Chart
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/50">
        <div className="flex items-center gap-2">
          <span>PROGRESS</span>
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-75"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <span className="text-white/80 w-8">{Math.round(progress * 100)}%</span>
        </div>

        {/* Scroll Cue */}
        <div
          style={{ opacity: cueOpacity }}
          className="flex flex-col items-center gap-1.5 transition-opacity duration-300"
          aria-hidden={cueOpacity <= 0}
        >
          <span className="text-[10px] uppercase tracking-widest text-white/60">Scroll to rotate</span>
          <div className="w-4 h-7 border border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-1.5 bg-amber-400 rounded-full animate-bounce" />
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <span>ANODIZED ALUMINUM • WEATHER SEALED</span>
        </div>
      </footer>
    </div>
  );
}
