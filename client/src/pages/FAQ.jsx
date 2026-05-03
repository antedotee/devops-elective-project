export default function FAQ() {
  const items = [
    {
      q: "Is checkout real?",
      a: "Not yet — cart persists in your browser so the rest of the stack stays the hero.",
    },
    {
      q: "Where does auth live?",
      a: "Users + hashed passwords live in Postgres. Sessions are JWTs in httpOnly cookies.",
    },
    {
      q: "Why neobrutalism?",
      a: "High-contrast borders make it obvious when layout breaks. Also: it slaps.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div className="border-b-4 border-neo-ink pb-6">
        <p className="font-display uppercase text-xs tracking-[0.2em] text-neutral-600 mb-2">
          FAQ page
        </p>
        <h1 className="font-display text-4xl uppercase">Straight answers</h1>
      </div>
      <ul className="space-y-4">
        {items.map(({ q, a }) => (
          <li
            key={q}
            className="border-4 border-neo-ink bg-neo-paper p-6 shadow-neo hover:-translate-y-0.5 transition-transform"
          >
            <p className="font-display uppercase text-sm mb-2">{q}</p>
            <p className="font-medium text-neutral-800">{a}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
