import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden border-b-4 border-neo-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5 space-y-8">
            <p className="inline-block border-4 border-neo-ink bg-neo-mint px-3 py-1 font-display uppercase text-xs tracking-widest shadow-neo-sm">
              Neo drop · SS26
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.05] uppercase tracking-tight text-neo-ink">
              Stack your look loud.
            </h1>

            <p className="text-base font-medium max-w-md border-l-4 border-neo-pink pl-4">
              Bold silhouettes, slab shadows, zero fluff. Browse real inventory
              from our API — sign up to save your cart vibe for later.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 border-4 border-neo-ink bg-neo-yellow px-8 py-4 font-display uppercase text-sm tracking-wide shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-neo-sm transition-transform"
              >
                Shop now
                <ArrowUpRight size={20} strokeWidth={2.5} />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 border-4 border-neo-ink bg-neo-paper px-6 py-4 font-bold uppercase text-xs tracking-wide shadow-neo hover:bg-neo-lilac transition-colors"
              >
                Create account
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-md pt-4">
              {[
                { k: "SKU live", v: "Postgres" },
                { k: "Ship mindset", v: "ECS+Fargate" },
                { k: "Hot takes", v: "JWT cookies" },
              ].map(({ k, v }) => (
                <div
                  key={k}
                  className="border-4 border-neo-ink bg-neo-paper p-3 shadow-neo-sm"
                >
                  <p className="font-display text-[10px] uppercase text-neutral-600">
                    {k}
                  </p>
                  <p className="font-bold text-sm">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative border-4 border-neo-ink bg-neo-ink shadow-[12px_12px_0_0_#ff6b9d]">
              <img
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1400&q=80"
                alt="Model in chunky knit streetwear"
                className="w-full aspect-[4/5] object-cover object-top grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                <span className="border-4 border-neo-ink bg-neo-yellow px-3 py-1 font-display uppercase text-xs shadow-neo-sm">
                  Brick & mortar energy
                </span>
                <span className="border-4 border-neo-ink bg-neo-blue text-neo-paper px-3 py-1 font-display uppercase text-xs shadow-neo-sm">
                  ALB routed
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <Link
            to="/collections?search=outerwear"
            className="group border-4 border-neo-ink bg-neo-lilac min-h-[220px] shadow-neo hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#0a0a0a] transition-transform flex flex-col justify-between p-6"
          >
            <span className="font-display uppercase text-lg">Outer layers</span>
            <span className="font-bold text-sm underline decoration-4 decoration-neo-ink">
              Shop coats →
            </span>
          </Link>
          <Link
            to="/collections?search=denim"
            className="group border-4 border-neo-ink bg-neo-mint min-h-[220px] shadow-neo hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#0a0a0a] transition-transform flex flex-col justify-between p-6"
          >
            <span className="font-display uppercase text-lg">Heavy denim</span>
            <span className="font-bold text-sm underline decoration-4 decoration-neo-ink">
              Wide fits →
            </span>
          </Link>
          <Link
            to="/collections?search=footwear"
            className="group border-4 border-neo-ink bg-neo-pink min-h-[220px] shadow-neo hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#0a0a0a] transition-transform flex flex-col justify-between p-6"
          >
            <span className="font-display uppercase text-lg">Footwear lab</span>
            <span className="font-bold text-sm underline decoration-4 decoration-neo-ink">
              Lace up →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
