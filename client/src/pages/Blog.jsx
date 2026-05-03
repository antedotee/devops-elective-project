import { Link } from "react-router-dom";

const posts = [
  {
    title: "Shipping Fargate without losing your mind",
    tag: "DevOps",
    blurb: "ALB DNS beats copy-pasting task IPs. Fight me.",
  },
  {
    title: "Why we still love monolith containers for class",
    tag: "Architecture",
    blurb: "One image means one CI path and fewer moving parts.",
  },
  {
    title: "Postgres in RDS, not in the container",
    tag: "Data",
    blurb: "Let AWS manage backups; keep the app dumb and stateless.",
  },
];

export default function Blog() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      <div className="border-4 border-neo-ink bg-neo-lilac shadow-neo p-8 sm:p-10">
        <p className="font-display uppercase text-xs tracking-[0.3em] mb-3">
          Blog page
        </p>
        <h1 className="font-display text-4xl uppercase mb-4">Field notes</h1>
        <p className="font-medium max-w-xl">
          Opinionated blurbs shipping with the SPA — links below bounce you back
          into product land because we actually care about circulation.
        </p>
      </div>

      <ul className="space-y-6">
        {posts.map((post) => (
          <li
            key={post.title}
            className="border-4 border-neo-ink bg-neo-paper p-6 shadow-neo flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
          >
            <div>
              <span className="inline-block border-4 border-neo-ink bg-neo-yellow px-2 py-0.5 font-display uppercase text-[10px] mb-2">
                {post.tag}
              </span>
              <h2 className="font-display text-2xl uppercase leading-tight">
                {post.title}
              </h2>
              <p className="mt-2 font-medium text-neutral-700">{post.blurb}</p>
            </div>
            <Link
              to="/collections"
              className="shrink-0 self-start border-4 border-neo-ink bg-neo-mint px-4 py-2 font-bold uppercase text-xs shadow-neo-sm whitespace-nowrap"
            >
              Shop related →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
