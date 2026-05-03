import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { AlignLeft, Search, ShoppingBag, User, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const navLinkClass = ({ isActive }) =>
  [
    "font-semibold uppercase tracking-wide text-sm px-3 py-2 border-4 border-transparent rounded-none",
    isActive
      ? "bg-neo-yellow border-neo-ink shadow-neo-sm"
      : "hover:bg-neo-paper hover:border-neo-ink hover:shadow-neo-sm",
  ].join(" ");

const pillClass =
  "inline-flex items-center gap-1 px-4 py-2 border-4 border-neo-ink bg-neo-paper font-semibold uppercase text-xs tracking-wide shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-transform whitespace-nowrap";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState(searchParams.get("search") || "");
  const { user, logout } = useAuth();
  const { count } = useCart();

  useEffect(() => {
    setQ(searchParams.get("search") || "");
  }, [searchParams]);

  function onSearch(e) {
    e.preventDefault();
    const term = q.trim();
    navigate(
      term ? `/collections?search=${encodeURIComponent(term)}` : "/collections",
    );
    setMenuOpen(false);
  }

  const drawerLinks = [
    { to: "/collections", label: "Shop all" },
    { to: "/about", label: "About" },
    { to: "/blog", label: "Blog" },
    { to: "/faq", label: "FAQ" },
    { to: "/cart", label: "Cart" },
    ...(user
      ? [{ to: "/profile", label: "Account" }]
      : [
          { to: "/login", label: "Log in" },
          { to: "/register", label: "Sign up" },
        ]),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b-4 border-neo-ink bg-neo-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            className="md:hidden p-2 border-4 border-neo-ink bg-neo-yellow shadow-neo active:shadow-none"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <AlignLeft size={22} strokeWidth={2.5} />
          </button>

          <Link
            to="/"
            className="font-display text-xl sm:text-2xl tracking-tight uppercase flex-shrink-0 border-4 border-transparent hover:border-neo-ink hover:bg-neo-yellow hover:shadow-neo px-2 py-1 transition-colors"
          >
            SHOPSMART
          </Link>

          <nav className="hidden md:flex items-center gap-2 flex-wrap justify-center">
            <NavLink to="/collections" className={navLinkClass}>
              Shop
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/blog" className={navLinkClass}>
              Blog
            </NavLink>
            <NavLink to="/faq" className={navLinkClass}>
              FAQ
            </NavLink>
          </nav>

          <div className="flex items-center gap-3 flex-shrink-0">
            <form onSubmit={onSearch} className="hidden sm:flex relative">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search gear..."
                className="w-44 lg:w-56 border-4 border-neo-ink bg-neo-paper pl-3 pr-10 py-2 text-sm font-medium placeholder:text-neutral-500 focus:outline-none focus:ring-0 focus:bg-neo-yellow"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neo-ink"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={2.5} />
              </button>
            </form>

            <Link
              to={user ? "/profile" : "/login"}
              aria-label={user ? "Account" : "Log in"}
              className="p-2 border-4 border-neo-ink bg-neo-mint shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-transform"
            >
              <User size={20} strokeWidth={2.5} />
            </Link>

            <Link
              to="/cart"
              aria-label="Shopping cart"
              className="p-2 border-4 border-neo-ink bg-neo-pink shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-transform relative"
            >
              <ShoppingBag size={20} strokeWidth={2.5} />
              {count > 0 ? (
                <span className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 px-1 flex items-center justify-center bg-neo-ink text-neo-yellow text-[10px] font-display border-2 border-neo-yellow">
                  {count > 99 ? "99+" : count}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 hidden md:flex flex-wrap gap-2 items-center justify-between border-t-4 border-neo-ink border-dashed pt-4 mt-0">
          <Link to="/collections" className={pillClass}>
            Clothing
          </Link>
          {["New arrivals", "Outerwear", "Denim", "Footwear", "Knits"].map(
            (label) => (
              <Link
                key={label}
                to={`/collections?search=${encodeURIComponent(label)}`}
                className="px-5 py-2 border-4 border-neo-ink bg-neo-lilac font-bold uppercase text-xs tracking-wide shadow-neo hover:bg-neo-yellow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-transform whitespace-nowrap"
              >
                {label}
              </Link>
            ),
          )}
        </div>
      </header>

      {menuOpen ? (
        <div
          className="fixed inset-0 z-50 md:hidden bg-neo-ink/40"
          role="presentation"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-[min(100%,320px)] bg-neo-bg border-r-4 border-neo-ink shadow-[12px_0_0_0_#0a0a0a] flex flex-col"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b-4 border-neo-ink bg-neo-yellow">
              <span className="font-display uppercase text-lg">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                className="p-2 border-4 border-neo-ink bg-neo-bg shadow-neo active:shadow-none"
                onClick={() => setMenuOpen(false)}
              >
                <X size={22} />
              </button>
            </div>
            <form onSubmit={onSearch} className="p-4 border-b-4 border-neo-ink flex gap-2">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                className="flex-1 border-4 border-neo-ink bg-neo-paper px-3 py-2 text-sm font-medium focus:outline-none focus:bg-neo-mint"
              />
              <button
                type="submit"
                className="border-4 border-neo-ink bg-neo-pink px-3 shadow-neo font-display uppercase text-xs"
              >
                Go
              </button>
            </form>
            <nav className="flex flex-col gap-2 p-4 overflow-y-auto">
              {drawerLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="py-3 px-4 border-4 border-neo-ink bg-neo-paper font-bold uppercase tracking-wide shadow-neo hover:bg-neo-yellow"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {user ? (
                <button
                  type="button"
                  className="text-left py-3 px-4 border-4 border-neo-ink bg-neo-lilac font-bold uppercase tracking-wide shadow-neo hover:bg-neo-pink"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  Log out
                </button>
              ) : null}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
