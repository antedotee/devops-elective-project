const { Pool } = require("pg");

let pool;

function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 8,
      idleTimeoutMillis: 20_000,
    });
  }
  return pool;
}

module.exports = { getPool };
