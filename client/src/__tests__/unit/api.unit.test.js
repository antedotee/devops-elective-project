import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getProduct,
  getProducts,
  login,
  register,
  searchProducts,
} from "../../api/api";

const expectApiUrl = (pathWithLeadingSlash) =>
  expect.stringMatching(
    new RegExp(
      `${pathWithLeadingSlash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
    ),
  );

const mockFetch = (data, ok = true) => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok,
      status: ok ? 200 : 400,
      text: () =>
        Promise.resolve(typeof data === "string" ? data : JSON.stringify(data)),
    }),
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("API — Unit Tests (mocked fetch)", () => {
  it("getProducts() calls GET /api/products", async () => {
    const mockData = [{ id: 1, name: "T-Shirt", slug: "t-shirt" }];
    mockFetch(mockData);
    const result = await getProducts();
    expect(global.fetch).toHaveBeenCalledWith(
      expectApiUrl("/api/products"),
      expect.any(Object),
    );
    expect(result).toEqual(mockData);
  });

  it("searchProducts(query) encodes query in URL", async () => {
    mockFetch([{ id: 1, name: "Blue Dress", slug: "blue-dress" }]);
    await searchProducts("blue dress");
    expect(global.fetch).toHaveBeenCalledWith(
      expectApiUrl("/api/products?search=blue%20dress"),
      expect.any(Object),
    );
  });

  it("getProduct(slug) calls GET /api/products/:slug", async () => {
    const mockData = { id: 42, name: "Sneakers", slug: "run-fast" };
    mockFetch(mockData);
    const result = await getProduct("run-fast");
    expect(global.fetch).toHaveBeenCalledWith(
      expectApiUrl("/api/products/run-fast"),
      expect.any(Object),
    );
    expect(result.slug).toBe("run-fast");
  });

  it("login posts JSON credentials", async () => {
    mockFetch({ user: { id: 1, email: "a@b.com" } });
    await login("a@b.com", "secretpass");
    expect(global.fetch).toHaveBeenCalledWith(
      expectApiUrl("/api/auth/login"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "a@b.com", password: "secretpass" }),
      }),
    );
  });

  it("register posts JSON credentials", async () => {
    mockFetch({ user: { id: 2, email: "n@u.com" } });
    await register("n@u.com", "password12");
    expect(global.fetch).toHaveBeenCalledWith(
      expectApiUrl("/api/auth/register"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "n@u.com", password: "password12" }),
      }),
    );
  });
});
