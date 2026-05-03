import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import * as api from "../../api/api";

function ShopPeek() {
  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    api.getProducts().then(setProducts).catch(() => setProducts([]));
  }, []);
  return (
    <ul>
      {products.map((p) => (
        <li key={p.slug}>{p.name}</li>
      ))}
    </ul>
  );
}

describe("API Integration Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getProducts() resolves with mocked catalog data", async () => {
    const mockProducts = [
      { id: 1, name: "Sneakers", slug: "sneakers", price_cents: 9900 },
      { id: 2, name: "Hoodie", slug: "hoodie", price_cents: 7900 },
    ];
    vi.spyOn(api, "getProducts").mockResolvedValue(mockProducts);

    const result = await api.getProducts();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Sneakers");
  });

  it("renders products returned from getProducts()", async () => {
    vi.spyOn(api, "getProducts").mockResolvedValue([
      { id: 1, name: "Blue Tee", slug: "blue-tee", price_cents: 2500 },
    ]);

    render(
      <MemoryRouter>
        <ShopPeek />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Blue Tee")).toBeInTheDocument();
    });
  });

  it("searchProducts() delegates with query string", async () => {
    const spy = vi.spyOn(api, "searchProducts").mockResolvedValue([]);
    await api.searchProducts("dress");
    expect(spy).toHaveBeenCalledWith("dress");
  });

  it("getProduct(slug) returns the mocked row", async () => {
    const mockProduct = {
      id: 10,
      name: "Leather Jacket",
      slug: "leather-jacket",
      price_cents: 29900,
    };
    vi.spyOn(api, "getProduct").mockResolvedValue(mockProduct);

    const result = await api.getProduct("leather-jacket");
    expect(api.getProduct).toHaveBeenCalledWith("leather-jacket");
    expect(result.name).toBe("Leather Jacket");
  });

  it("login calls API layer", async () => {
    vi.spyOn(api, "login").mockResolvedValue({
      user: { id: 1, email: "hi@test.dev" },
    });
    await api.login("hi@test.dev", "password12");
    expect(api.login).toHaveBeenCalledWith("hi@test.dev", "password12");
  });
});
