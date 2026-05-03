import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      await login(email, password);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="border-4 border-neo-ink bg-neo-paper shadow-[12px_12px_0_0_#ffe500] p-8 space-y-6">
        <h1 className="font-display text-3xl uppercase">Log in</h1>
        <p className="text-sm font-medium text-neutral-700">
          JWT lands in an HTTP-only cookie — same-origin friendly behind your ALB.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-1">
            <span className="font-bold uppercase text-xs">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-4 border-neo-ink bg-neo-bg px-3 py-3 font-medium focus:outline-none focus:bg-neo-mint"
            />
          </label>
          <label className="block space-y-1">
            <span className="font-bold uppercase text-xs">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-4 border-neo-ink bg-neo-bg px-3 py-3 font-medium focus:outline-none focus:bg-neo-mint"
            />
          </label>

          {error ? (
            <p className="border-4 border-neo-ink bg-neo-pink px-3 py-2 font-bold text-sm">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full border-4 border-neo-ink bg-neo-yellow py-4 font-display uppercase shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-transform disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Enter"}
          </button>
        </form>

        <p className="text-sm font-medium">
          New here?{" "}
          <Link to="/register" className="underline decoration-4 decoration-neo-pink font-bold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
