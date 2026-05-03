const express = require("express");
const { getPool } = require("../db/pool");

const router = express.Router();

function requireDb(req, res, next) {
  if (!getPool()) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }
  next();
}

router.use(requireDb);

function mapRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price_cents: row.price_cents,
    category: row.category,
    image_url: row.image_url,
    created_at: row.created_at,
  };
}

router.get("/", async (req, res) => {
  try {
    const pool = getPool();
    const search = String(req.query.search || "").trim();
    let rows;
    if (search) {
      const q = `%${search}%`;
      const result = await pool.query(
        `SELECT id, slug, name, description, price_cents, category, image_url, created_at
         FROM products
         WHERE name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1 OR slug ILIKE $1
         ORDER BY id ASC`,
        [q],
      );
      rows = result.rows;
    } else {
      const result = await pool.query(
        `SELECT id, slug, name, description, price_cents, category, image_url, created_at
         FROM products
         ORDER BY id ASC`,
      );
      rows = result.rows;
    }
    res.json(rows.map(mapRow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load products" });
  }
});

router.get("/:idOrSlug", async (req, res) => {
  try {
    const pool = getPool();
    const raw = req.params.idOrSlug;
    const asNum = Number.parseInt(raw, 10);
    const byId = Number.isFinite(asNum) && String(asNum) === raw;

    let rows;
    if (byId) {
      const result = await pool.query(
        `SELECT id, slug, name, description, price_cents, category, image_url, created_at
         FROM products WHERE id = $1`,
        [asNum],
      );
      rows = result.rows;
    } else {
      const result = await pool.query(
        `SELECT id, slug, name, description, price_cents, category, image_url, created_at
         FROM products WHERE slug = $1`,
        [raw],
      );
      rows = result.rows;
    }

    if (!rows.length) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(mapRow(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load product" });
  }
});

module.exports = router;
