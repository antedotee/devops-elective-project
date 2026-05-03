import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../api/api";
import { useCart } from "../contexts/CartContext";

function formatPrice(cents) {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

export default function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getProduct(slug)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Product not found");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  function handleAdd() {
    if (!product) return;
    addItem(product, qty);
    navigate("/cart");
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 font-display uppercase">
        Loading…
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 space-y-6">
        <div className="border-4 border-neo-ink bg-neo-pink p-6 shadow-neo">
          <p className="font-display uppercase text-xl mb-2">Missed connection</p>
          <p>{error}</p>
        </div>
        <Link
          to="/collections"
          className="inline-block border-4 border-neo-ink bg-neo-yellow px-6 py-3 font-display uppercase shadow-neo"
        >
          ← Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-8 border-4 border-neo-ink bg-neo-paper px-4 py-2 font-bold uppercase text-xs shadow-neo hover:bg-neo-mint transition-colors"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="border-4 border-neo-ink shadow-[12px_12px_0_0_#0a0a0a] bg-neo-cream">
          <img
            src={product.image_url}
            alt=""
            className="w-full aspect-square object-cover"
          />
        </div>

        <div className="space-y-6">
          <p className="inline-block border-4 border-neo-ink bg-neo-blue text-neo-paper font-display uppercase text-xs px-3 py-1 shadow-neo-sm">
            {product.category}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl uppercase leading-tight">
            {product.name}
          </h1>
          <p className="text-lg font-medium max-w-lg border-l-4 border-neo-yellow pl-4">
            {product.description}
          </p>
          <p className="font-display text-3xl">{formatPrice(product.price_cents)}</p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <label className="flex items-center gap-2 font-bold uppercase text-xs">
              Qty
              <input
                type="number"
                min={1}
                max={99}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value) || 1)}
                className="w-16 border-4 border-neo-ink bg-neo-paper px-2 py-2 font-bold text-center"
              />
            </label>
            <button
              type="button"
              onClick={handleAdd}
              className="border-4 border-neo-ink bg-neo-yellow px-8 py-4 font-display uppercase shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-neo-sm transition-transform"
            >
              Add to cart
            </button>
          </div>

          <p className="text-sm text-neutral-700 max-w-md">
            Cart syncs in your browser for now — classic MVP brutalism. Sign in to
            prove this stack ships auth too.
          </p>
        </div>
      </div>
    </div>
  );
}
