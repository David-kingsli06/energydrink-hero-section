"use client";

import React, { useRef, Suspense } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { TinScene } from "./TinScene";
import { HeroOverlay } from "./HeroOverlay";

interface TinHeroProps {
  brandName?: string;
  brandColor?: string;
}

export function TinHero({
  brandName = "AURA",
  brandColor = "#0284c7",
}: TinHeroProps) {
  // 300vh scroll container ref
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, prefersReducedMotion } = useScrollProgress(containerRef, 0.08);

  // Background gradient interpolation: deep obsidian (#05070a) shifting to cool glacial slate (#081426)
  const bgStyle = {
    background: prefersReducedMotion
      ? "radial-gradient(ellipse at 50% 50%, #0c1a2e 0%, #030712 100%)"
      : `radial-gradient(ellipse at 50% 45%, rgba(14, 116, 144, ${
          0.15 + progress * 0.22
        }) 0%, #040711 75%)`,
    transition: "background 200ms ease-out",
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300vh] bg-[#030712]"
      aria-label={`${brandName} 3D interactive hero showcase`}
    >
      {/* Sticky 100vh viewport container */}
      <div
        className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center"
        style={bgStyle}
      >
        {/* Subtle background ambient grid for industrial tech taste */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* 3D Scene Layer with Suspense Fallback */}
        <div className="absolute inset-0 z-0">
          <Suspense
            fallback={
              <div className="w-full h-full flex flex-col items-center justify-center text-white/40 gap-3">
                <div className="w-8 h-8 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" />
                <span className="font-mono text-xs uppercase tracking-widest">
                  Loading 3D Atmosphere...
                </span>
              </div>
            }
          >
            <TinScene
              progress={progress}
              brandName={brandName}
              brandColor={brandColor}
              prefersReducedMotion={prefersReducedMotion}
            />
          </Suspense>
        </div>

        {/* Text & Editorial UI Overlay Layer */}
        <HeroOverlay
          progress={progress}
          brandName={brandName}
          brandColor={brandColor}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>
    </div>
  );
}
