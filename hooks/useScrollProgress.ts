"use client";

import { useEffect, useState } from "react";

/**
 * useScrollProgress hook
 * Calculates normalized scroll progress [0, 1] through a target container element
 * using an RAF lerp (linear interpolation) damping loop for fluid, organic motion
 * following Emil Design Engineering principles (smooth settle, zero abrupt stops).
 *
 * @param containerRef React ref to the scroll container or pinned section
 * @param lerpFactor smoothing coefficient (default 0.08 for physical weight feel)
 */
export function useScrollProgress(
  containerRef: React.RefObject<HTMLElement | null>,
  lerpFactor: number = 0.08
): { progress: number; rawProgress: number; prefersReducedMotion: boolean } {
  const [progress, setProgress] = useState(0);
  const [rawProgress, setRawProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Respect user's accessibility reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const onMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", onMediaChange);
    return () => mediaQuery.removeEventListener("change", onMediaChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setProgress(1);
      setRawProgress(1);
      return;
    }

    let currentSmoothed = 0;
    let targetProgress = 0;
    let animationFrameId: number;

    const calculateScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const scrollHeight = el.scrollHeight || el.offsetHeight;
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = scrollHeight - windowHeight;

      if (totalScrollableDistance <= 0) {
        targetProgress = 0;
        return;
      }

      // Distance from top of element to top of viewport
      const scrolled = -rect.top;
      const unclipped = scrolled / totalScrollableDistance;
      targetProgress = Math.max(0, Math.min(1, unclipped));
      setRawProgress(targetProgress);
    };

    const updateLoop = () => {
      // Emil damping: smoothly ease toward target scroll value
      // delta * factor ensures high frame-rate displays (120Hz/ProMotion) don't jitter
      const diff = targetProgress - currentSmoothed;
      if (Math.abs(diff) > 0.0001) {
        currentSmoothed += diff * lerpFactor;
        setProgress(Number(currentSmoothed.toFixed(4)));
      } else if (currentSmoothed !== targetProgress) {
        currentSmoothed = targetProgress;
        setProgress(targetProgress);
      }

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener("scroll", calculateScroll, { passive: true });
    window.addEventListener("resize", calculateScroll, { passive: true });
    calculateScroll();
    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("scroll", calculateScroll);
      window.removeEventListener("resize", calculateScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [containerRef, lerpFactor, prefersReducedMotion]);

  return { progress, rawProgress, prefersReducedMotion };
}
