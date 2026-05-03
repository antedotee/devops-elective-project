import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../api/api";

function formatPrice(cents) {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

export default function Collection() {
  const [searchParams] = useSearchParams();
  const term = searchParams.get("search") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getProducts(term)
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load products");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [term]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b-4 border-neo-ink pb-8 mb-10">
        <div>
          <p className="font-display uppercase text-xs tracking-[0.2em] text-neutral-600 mb-2">
            Catalog · live from API
          </p>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight">
            {term ? `Results: “${term}”` : "Shop everything"}
          </h1>
        </div>
        <Link
          to="/"
          className="self-start border-4 border-neo-ink bg-neo-yellow px-4 py-2 font-bold uppercase text-xs shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-transform"
        >
          ← Back home
        </Link>
      </div>

      {loading ? (
        <p className="font-display uppercase text-lg border-4 border-dashed border-neo-ink p-8 bg-neo-paper inline-block">
          Loading inventory…
        </p>
      ) : null}

      {error ? (
        <div className="border-4 border-neo-ink bg-neo-pink p-6 shadow-neo max-w-xl">
          <p className="font-display uppercase mb-2">Heads up</p>
          <p className="font-medium">{error}</p>
          <p className="text-sm mt-2 text-neutral-800">
            Spin Postgres locally or deploy Terraform so DATABASE_URL reaches the
            container.
          </p>
        </div>
      ) : null}

      {!loading && !error ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <li key={p.slug}>
              <Link
                to={`/products/${encodeURIComponent(p.slug)}`}
                className="group block border-4 border-neo-ink bg-neo-paper shadow-neo hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#0a0a0a] transition-all"
              >
                <div className="aspect-square overflow-hidden border-b-4 border-neo-ink bg-neo-cream">
                  <img
                    src={p.image_url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-[11px] font-display uppercase tracking-widest text-neutral-600">
                    {p.category}
                  </p>
                  <h2 className="font-display text-xl uppercase leading-tight group-hover:bg-neo-yellow inline-block px-1">
                    {p.name}
                  </h2>
                  <p className="font-bold text-lg">{formatPrice(p.price_cents)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {!loading && !error && products.length === 0 ? (
        <p className="border-4 border-neo-ink bg-neo-lilac p-6 font-bold uppercase shadow-neo inline-block">
          No matches — tweak your search.
        </p>
      ) : null}
    </div>
  );
}
