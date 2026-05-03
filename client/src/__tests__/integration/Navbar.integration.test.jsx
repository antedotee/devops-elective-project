import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Navbar from "../../components/Navbar";
import { AuthProvider } from "../../contexts/AuthContext";
import { CartProvider } from "../../contexts/CartContext";

function renderNavbar() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ user: null })),
    }),
  );
});

describe("Navbar Integration Tests", () => {
  it('"About" link routes to /about', () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: /^about$/i })).toHaveAttribute(
      "href",
      "/about",
    );
  });

  it('"Blog" link routes to /blog', () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: /^blog$/i })).toHaveAttribute(
      "href",
      "/blog",
    );
  });

  it("Shopping cart icon routes to /cart", () => {
    renderNavbar();
    expect(
      screen.getByRole("link", { name: /shopping cart/i }),
    ).toHaveAttribute("href", "/cart");
  });

  it("logged-out account icon routes to /login", () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: /^log in$/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("Search input accepts typed text", async () => {
    renderNavbar();
    const searchInput = screen.getByPlaceholderText(/search gear/i);
    await userEvent.type(searchInput, "jeans");
    expect(searchInput.value).toBe("jeans");
  });

  it('"Clothing" pill links to /collections', () => {
    renderNavbar();
    const clothingLinks = screen.getAllByRole("link", { name: /^clothing$/i });
    expect(clothingLinks[0]).toHaveAttribute("href", "/collections");
  });

  it('"New arrivals" pill includes search query param', () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: /new arrivals/i })).toHaveAttribute(
      "href",
      "/collections?search=New%20arrivals",
    );
  });

  it("Logo sits inside header landmark", () => {
    renderNavbar();
    const logo = screen.getByText("SHOPSMART");
    expect(logo.closest("header")).toBeInTheDocument();
  });
});
