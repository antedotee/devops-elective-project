const BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function apiFetch(path, options = {}) {
  const headers = {
    Accept: "application/json",
    ...options.headers,
  };
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!res.ok) {
    const msg = data.error || res.statusText || "Request failed";
    throw new Error(msg);
  }
  return data;
}

export async function getProducts(search) {
  const q = search?.trim()
    ? `?search=${encodeURIComponent(search.trim())}`
    : "";
  return apiFetch(`/products${q}`, { method: "GET" });
}

export async function searchProducts(query) {
  return getProducts(query);
}

/** id (number) or slug string */
export async function getProduct(idOrSlug) {
  const segment = encodeURIComponent(String(idOrSlug));
  return apiFetch(`/products/${segment}`, { method: "GET" });
}

export async function register(email, password) {
  return apiFetch(`/auth/register`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email, password) {
  return apiFetch(`/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return apiFetch(`/auth/logout`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function getMe() {
  return apiFetch(`/auth/me`, { method: "GET" });
}
