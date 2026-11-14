"use client";

import React from "react";

interface HeroOverlayProps {
  progress: number;
  brandName?: string;
  brandColor?: string;
  prefersReducedMotion?: boolean;
}

/**
 * Calculates responsive opacity and vertical offset for text stage transitions
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
  let translateY = 16;

  if (progress >= start && progress <= end) {
    if (progress < fadeInEnd) {
      const t = (progress - start) / (fadeInEnd - start);
      opacity = t;
      translateY = 16 * (1 - t);
    } else if (progress > fadeOutStart && end < 0.98) {
      const t = (progress - fadeOutStart) / (end - fadeOutStart);
      opacity = 1 - t;
      translateY = -16 * t;
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
  brandName = "AURA",
  brandColor = "#0284c7",
  prefersReducedMotion = false,
}: HeroOverlayProps) {
  const cueOpacity = prefersReducedMotion ? 0 : Math.max(0, 1 - progress * 14);

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 md:p-14 pointer-events-none select-none">
      {/* Top Brand Bar */}
      <header className="w-full flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full shadow-lg"
            style={{
              backgroundColor: brandColor,
              boxShadow: `0 0 14px ${brandColor}`,
            }}
          />
          <span className="text-xs sm:text-sm font-mono tracking-[0.25em] text-white/90 uppercase font-semibold">
            {brandName} LABS
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] sm:text-xs tracking-widest uppercase font-mono text-white/50">
          <span>Formula 0.3</span>
          <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:inline-block" />
          <span className="hidden sm:inline-block">Cryo-Infused</span>
        </div>
      </header>

      {/* Main Center Overlay Text Stages */}
      <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center my-auto min-h-[320px]">
        {/* Stage 1: 0 - 0.33 */}
        <section
          style={getStageStyle(progress, 0.0, 0.33, prefersReducedMotion)}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          aria-hidden={progress > 0.33 && !prefersReducedMotion}
        >
          <p className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-cyan-400 mb-3 font-semibold">
            Genesis Release
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-tight drop-shadow-md">
            {brandName} Energy, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              unlocked.
            </span>
          </h1>
          <p className="mt-4 max-w-md text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Zero sugar. Active electrolytes. Precision tuned for hyper-focus and endurance.
          </p>
        </section>

        {/* Stage 2: 0.33 - 0.66 */}
        <section
          style={getStageStyle(progress, 0.33, 0.66, prefersReducedMotion)}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          aria-hidden={(progress < 0.33 || progress > 0.66) && !prefersReducedMotion}
        >
          <p className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-sky-400 mb-3 font-semibold">
            Thermodynamic Shift
          </p>
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-tight drop-shadow-md">
            Ice-cold, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-white bg-clip-text text-transparent">
              every time.
            </span>
          </h2>
          <p className="mt-4 max-w-md text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Rapid thermal dispersion casing ensures optimal refreshment with zero degradation.
          </p>
        </section>

        {/* Stage 3: 0.66 - 1.00 */}
        <section
          style={getStageStyle(progress, 0.66, 1.0, prefersReducedMotion)}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          aria-hidden={progress < 0.66 && !prefersReducedMotion}
        >
          <p className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-cyan-300 mb-3 font-semibold">
            Sub-Zero State
          </p>
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-tight drop-shadow-md">
            Feel the <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
              chill.
            </span>
          </h2>
          <p className="mt-4 max-w-md text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Crystalline frost lock seal. The coldest, most potent formula crafted for peak performance.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 pointer-events-auto">
            <button
              type="button"
              className="px-6 py-3 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white text-slate-950 hover:bg-slate-200 active:scale-95 transition-all shadow-[0_4px_24px_rgba(255,255,255,0.25)]"
            >
              Order 12-Pack
            </button>
            <button
              type="button"
              className="px-6 py-3 rounded-full text-xs font-mono font-semibold tracking-widest uppercase border border-white/20 text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              Learn More
            </button>
          </div>
        </section>
      </div>

      {/* Footer Navigation Bar */}
      <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/50">
        <div className="flex items-center gap-2">
          <span>PROGRESS</span>
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-75"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <span className="text-white/80 w-8">{Math.round(progress * 100)}%</span>
        </div>

        {/* Scroll Prompt */}
        <div
          style={{ opacity: cueOpacity }}
          className="flex flex-col items-center gap-1.5 transition-opacity duration-300"
          aria-hidden={cueOpacity <= 0}
        >
          <span className="text-[10px] uppercase tracking-widest text-white/60">Scroll to explore</span>
          <div className="w-4 h-7 border border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <span>CRYO-GEN V4 • RECYCLABLE ALUMINUM</span>
        </div>
      </footer>
    </div>
  );
}
