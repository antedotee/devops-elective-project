import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div className="border-4 border-neo-ink bg-neo-yellow shadow-neo p-8 sm:p-10">
        <p className="font-display uppercase text-xs tracking-[0.3em] mb-3">
          About us page
        </p>
        <h1 className="font-display text-4xl sm:text-5xl uppercase leading-tight mb-6">
          ShopSmart is a course-grade full stack
        </h1>
        <p className="text-lg font-medium leading-relaxed border-l-4 border-neo-ink pl-4">
          Terraform ships S3 + RDS + ECR + ECS Fargate + ALB. Express serves the
          React build, signs JWTs, and talks to Postgres. The UI is intentionally
          loud so you remember the wiring.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="border-4 border-neo-ink bg-neo-paper p-6 shadow-neo-sm">
          <h2 className="font-display uppercase text-lg mb-2">Frontend</h2>
          <p className="text-sm font-medium text-neutral-700">
            Vite + React + Tailwind with a neo-brutalist skin. Routes are real —
            BrowserRouter + Express SPA fallback.
          </p>
        </div>
        <div className="border-4 border-neo-ink bg-neo-mint p-6 shadow-neo-sm">
          <h2 className="font-display uppercase text-lg mb-2">Backend</h2>
          <p className="text-sm font-medium text-neutral-800">
            REST JSON, httpOnly cookies, bcrypt, and a product table seeded on
            boot.
          </p>
        </div>
      </div>

      <Link
        to="/collections"
        className="inline-block border-4 border-neo-ink bg-neo-pink px-6 py-3 font-display uppercase shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
      >
        Peep inventory →
      </Link>
    </div>
  );
}
