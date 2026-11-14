"use client";

import React, { useRef, Suspense } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { TinScene } from "./TinScene";
import { HeroOverlay } from "./HeroOverlay";

export function TinHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, prefersReducedMotion } = useScrollProgress(containerRef, 0.08);

  const bgStyle = {
    background: prefersReducedMotion
      ? "radial-gradient(ellipse at 65% 50%, #151821 0%, #030712 100%)"
      : `radial-gradient(ellipse at 65% 45%, rgba(30, 41, 59, ${
          0.35 + progress * 0.2
        }) 0%, #030712 80%)`,
    transition: "background 200ms ease-out",
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300vh] bg-[#030712]"
      aria-label="Lumen Optics 85mm f/1.4 3D interactive hero showcase"
    >
      <div
        className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center"
        style={bgStyle}
      >
        {/* Subtle engineering grid */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* 3D Lens Scene Layer */}
        <div className="absolute inset-0 z-0">
          <Suspense
            fallback={
              <div className="w-full h-full flex flex-col items-center justify-center text-white/40 gap-3">
                <div className="w-8 h-8 border-2 border-amber-400/40 border-t-amber-400 rounded-full animate-spin" />
                <span className="font-mono text-xs uppercase tracking-widest">
                  Loading Optical Elements...
                </span>
              </div>
            }
          >
            <TinScene
              progress={progress}
              prefersReducedMotion={prefersReducedMotion}
            />
          </Suspense>
        </div>

        {/* HUD and Text Stages Overlay */}
        <HeroOverlay
          progress={progress}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>
    </div>
  );
}
