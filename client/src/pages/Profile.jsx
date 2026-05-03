import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 font-display uppercase">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 space-y-6">
        <div className="border-4 border-neo-ink bg-neo-lilac p-8 shadow-neo space-y-4">
          <h1 className="font-display text-3xl uppercase">Account</h1>
          <p className="font-medium">
            Log in to attach this brutal session to your Postgres-backed identity.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/login"
              className="border-4 border-neo-ink bg-neo-yellow px-6 py-3 font-display uppercase shadow-neo"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="border-4 border-neo-ink bg-neo-paper px-6 py-3 font-bold uppercase shadow-neo hover:bg-neo-pink transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16 space-y-8">
      <div className="border-4 border-neo-ink bg-neo-paper shadow-[10px_10px_0_0_#6dffc6] p-8 space-y-4">
        <h1 className="font-display text-3xl uppercase">Welcome back</h1>
        <p className="text-sm uppercase tracking-widest text-neutral-600">
          Signed in as
        </p>
        <p className="font-display text-xl break-all">{user.email}</p>
        <button
          type="button"
          onClick={() => logout()}
          className="border-4 border-neo-ink bg-neo-pink px-6 py-3 font-display uppercase shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
        >
          Log out
        </button>
      </div>

      <Link
        to="/collections"
        className="inline-block border-4 border-neo-ink bg-neo-yellow px-6 py-3 font-bold uppercase shadow-neo"
      >
        Continue shopping →
      </Link>
    </div>
  );
}
