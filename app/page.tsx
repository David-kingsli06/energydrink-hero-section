import { TinHero } from "@/components/hero/TinHero";

/**
 * Main Landing Page
 * Full-screen scroll-driven 3D hero section.
 * Configurable Brand name and Brand color.
 */
export default function Home() {
  const BRAND = "AURA";
  const COLOR = "#0284c7"; // Electrifying glacial cyan-blue

  return (
    <main className="w-full bg-[#030712] text-slate-100 min-h-screen selection:bg-cyan-500 selection:text-white">
      <h1 className="sr-only">
        {BRAND} Energy - High Performance Sub-Zero Energy Drink
      </h1>

      {/* 300vh Scroll-controlled 3D Hero */}
      <TinHero brandName={BRAND} brandColor={COLOR} />

      {/* Content Section below the hero */}
      <section className="relative z-20 w-full py-28 px-6 sm:px-12 max-w-6xl mx-auto border-t border-white/10 bg-[#030712]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <span className="text-cyan-400 font-mono text-sm tracking-wider uppercase">01 / Temperature</span>
            <h3 className="text-xl font-bold mt-2 text-white">Sub-Zero Infusion</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Brewed under precise cryogenic parameters to capture delicate botanical nuances and rapid-absorption electrolytes.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <span className="text-sky-400 font-mono text-sm tracking-wider uppercase">02 / Clean Formula</span>
            <h3 className="text-xl font-bold mt-2 text-white">Zero Crash Curve</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Engineered with natural guayusa, L-theanine, and zero refined sugar for sustained 6-hour neural stamina.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <span className="text-indigo-400 font-mono text-sm tracking-wider uppercase">03 / Ecology</span>
            <h3 className="text-xl font-bold mt-2 text-white">Infinite Aluminum</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              100% endlessly recyclable aluminum vessel with rapid cooling conductivity and minimal carbon footprint.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
