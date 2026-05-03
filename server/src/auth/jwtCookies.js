const jwt = require("jsonwebtoken");

const COOKIE = "shopsmart_token";

function getJwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is required when DATABASE_URL is set");
  return s;
}

function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

function verifyToken(token) {
  try {
    const s = process.env.JWT_SECRET;
    if (!s) return null;
    return jwt.verify(token, s);
  } catch {
    return null;
  }
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE, { path: "/" });
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

function readToken(req) {
  const raw = req.cookies?.[COOKIE];
  return typeof raw === "string" ? raw : null;
}

module.exports = {
  COOKIE,
  signToken,
  verifyToken,
  clearAuthCookie,
  setAuthCookie,
  readToken,
};
