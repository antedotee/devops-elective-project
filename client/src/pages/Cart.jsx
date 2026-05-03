import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

function formatPrice(cents) {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

export default function Cart() {
  const { items, setQty, removeLine, clear } = useCart();
  const subtotal = items.reduce(
    (sum, line) => sum + line.price_cents * line.qty,
    0,
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-4 border-neo-ink pb-8">
        <div>
          <p className="font-display uppercase text-xs tracking-[0.2em] text-neutral-600 mb-1">
            Browser cart
          </p>
          <h1 className="font-display text-4xl uppercase">Your stack</h1>
        </div>
        <Link
          to="/collections"
          className="border-4 border-neo-ink bg-neo-yellow px-4 py-2 font-bold uppercase text-xs shadow-neo"
        >
          Keep shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="border-4 border-dashed border-neo-ink bg-neo-cream p-10 text-center space-y-4">
          <p className="font-display text-xl uppercase">Empty tote</p>
          <p className="font-medium text-neutral-700">
            Add products from the shop — we keep this cart in localStorage.
          </p>
          <Link
            to="/collections"
            className="inline-block border-4 border-neo-ink bg-neo-mint px-6 py-3 font-display uppercase shadow-neo"
          >
            Browse catalog
          </Link>
        </div>
      ) : (
        <ul className="space-y-6">
          {items.map((line) => (
            <li
              key={line.slug}
              className="flex flex-col sm:flex-row gap-4 border-4 border-neo-ink bg-neo-paper shadow-neo p-4"
            >
              <div className="w-full sm:w-28 h-28 border-4 border-neo-ink shrink-0 overflow-hidden bg-neo-bg">
                <img
                  src={line.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between gap-3">
                <div>
                  <Link
                    to={`/products/${line.slug}`}
                    className="font-display text-lg uppercase hover:bg-neo-yellow inline-block px-1"
                  >
                    {line.name}
                  </Link>
                  <p className="font-bold mt-1">{formatPrice(line.price_cents)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 font-bold uppercase text-xs">
                    Qty
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={line.qty}
                      onChange={(e) =>
                        setQty(line.slug, Number(e.target.value) || 1)
                      }
                      className="w-16 border-4 border-neo-ink bg-neo-bg px-2 py-1 font-bold text-center"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeLine(line.slug)}
                    className="border-4 border-neo-ink bg-neo-pink px-3 py-1 font-bold uppercase text-xs shadow-neo-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {items.length > 0 ? (
        <div className="border-4 border-neo-ink bg-neo-blue text-neo-paper p-6 shadow-neo flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-display uppercase text-xs tracking-widest opacity-90">
              Subtotal
            </p>
            <p className="font-display text-3xl">{formatPrice(subtotal)}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => clear()}
              className="border-4 border-neo-paper bg-transparent text-neo-paper px-4 py-3 font-display uppercase text-sm hover:bg-neo-paper hover:text-neo-ink transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              className="border-4 border-neo-ink bg-neo-yellow text-neo-ink px-6 py-3 font-display uppercase shadow-neo opacity-80 cursor-not-allowed"
              title="Checkout not wired — demo storefront"
              disabled
            >
              Checkout (soon)
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
