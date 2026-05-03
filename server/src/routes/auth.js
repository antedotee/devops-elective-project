const express = require("express");
const bcrypt = require("bcryptjs");
const { getPool } = require("../db/pool");
const {
  signToken,
  setAuthCookie,
  clearAuthCookie,
  readToken,
  verifyToken,
} = require("../auth/jwtCookies");

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireDb(req, res, next) {
  if (!getPool()) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }
  next();
}

router.get("/me", (req, res) => {
  const token = readToken(req);
  if (!token) {
    res.json({ user: null });
    return;
  }
  const payload = verifyToken(token);
  if (!payload?.sub) {
    clearAuthCookie(res);
    res.json({ user: null });
    return;
  }
  res.json({
    user: { id: Number(payload.sub), email: payload.email },
  });
});

router.post("/logout", (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.use(requireDb);

router.post("/register", async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");

    if (!EMAIL_RE.test(email)) {
      res.status(400).json({ error: "Invalid email" });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }

    const hash = await bcrypt.hash(password, 10);
    const pool = getPool();
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, created_at`,
      [email, hash],
    );

    const user = rows[0];
    const token = signToken({ sub: String(user.id), email: user.email });
    setAuthCookie(res, token);
    res.status(201).json({
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    if (err.code === "23505") {
      res.status(409).json({ error: "Email already registered" });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    const pool = getPool();
    const { rows } = await pool.query(
      "SELECT id, email, password_hash FROM users WHERE email = $1",
      [email],
    );

    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = signToken({ sub: String(user.id), email: user.email });
    setAuthCookie(res, token);
    res.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
