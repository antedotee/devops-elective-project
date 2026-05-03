const { getPool } = require("./pool");

const SEED_PRODUCTS = [
  {
    slug: "neon-puffer-volt",
    name: "Neon Puffer — Volt",
    description:
      "Oversized channel-quilt shell, black zip tape, stash pockets. Built for sidewalks, not ski lifts.",
    price_cents: 18900,
    category: "Outerwear",
    image_url:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "concrete-denim-wide",
    name: "Concrete Denim — Wide",
    description:
      "Rigid 14oz cotton, cropped blocky fit, contrast topstitch. Pairs with loud socks.",
    price_cents: 9800,
    category: "Denim",
    image_url:
      "https://images.unsplash.com/photo-1541099649105-f69ad21fb324?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "signal-knit-barcode",
    name: "Signal Knit Barcode",
    description:
      "Jacquard stripe sweater in wool blend. Warm enough for brutalist winters.",
    price_cents: 7600,
    category: "Knits",
    image_url:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "court-clash-high",
    name: "Court Clash High-Tops",
    description:
      "Panelled leather, gum sole, exaggerated foxing. Scuffs encouraged.",
    price_cents: 13200,
    category: "Footwear",
    image_url:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "cargo-stack-six",
    name: "Cargo Stack — Six Pocket",
    description:
      "Bar-tacked pockets, tapered hem, ripstop weave. Holds chargers and receipts.",
    price_cents: 8900,
    category: "Bottoms",
    image_url:
      "https://images.unsplash.com/photo-1517445318724-f98702234162?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "glassline-track-jacket",
    name: "Glassline Track Jacket",
    description:
      "Retro piping, scuba collar, contrast zipper pull. Warm-up energy.",
    price_cents: 7100,
    category: "Outerwear",
    image_url:
      "https://images.unsplash.com/photo-1617137988744-f524f060474d?auto=format&fit=crop&w=900&q=80",
  },
];

async function migrate() {
  const pool = getPool();
  if (!pool) {
    console.warn("DATABASE_URL not set — skipping migrations");
    return;
  }

  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price_cents INTEGER NOT NULL,
        category VARCHAR(100),
        image_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    const { rows } = await client.query(
      "SELECT COUNT(*)::int AS c FROM products",
    );
    if (rows[0].c === 0) {
      for (const p of SEED_PRODUCTS) {
        await client.query(
          `INSERT INTO products (slug, name, description, price_cents, category, image_url)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (slug) DO NOTHING`,
          [
            p.slug,
            p.name,
            p.description,
            p.price_cents,
            p.category,
            p.image_url,
          ],
        );
      }
      console.log(`Seeded ${SEED_PRODUCTS.length} products`);
    }
  } finally {
    client.release();
  }
}

module.exports = { migrate };
