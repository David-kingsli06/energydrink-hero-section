import { TinHero } from "@/components/hero/TinHero";

/**
 * Main Landing Page - Lumen Optics 85mm f/1.4 Master Series
 */
export default function Home() {
  return (
    <main className="w-full bg-[#030712] text-slate-100 min-h-screen selection:bg-amber-500 selection:text-black">
      <h1 className="sr-only">
        Lumen Optics 85mm f/1.4 - Precision Prime Lens
      </h1>

      {/* 300vh Scroll-controlled 3D Hero */}
      <TinHero />

      {/* Engineering Specs section below hero */}
      <section className="relative z-20 w-full py-28 px-6 sm:px-12 max-w-6xl mx-auto border-t border-white/10 bg-[#030712]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <span className="text-amber-400 font-mono text-sm tracking-wider uppercase">01 / Optics</span>
            <h3 className="text-xl font-bold mt-2 text-white">Nano Crystal Coat</h3>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Proprietary sub-wavelength anti-reflective coating virtually eliminates ghosting and flare in high backlight conditions.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <span className="text-amber-400 font-mono text-sm tracking-wider uppercase">02 / Mechanics</span>
            <h3 className="text-xl font-bold mt-2 text-white">Dual Ultrasonic Drive</h3>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Quiet, high-speed autofocus with instant manual override and zero focus breathing for cinema workflow.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <span className="text-amber-400 font-mono text-sm tracking-wider uppercase">03 / Build</span>
            <h3 className="text-xl font-bold mt-2 text-white">Magnesium Alloy Chassis</h3>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Precision CNC machined with weather sealing rubber gaskets at all critical barrel and bayonet interfaces.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
