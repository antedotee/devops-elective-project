import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../App";

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

describe("App Integration — Route Rendering", () => {
  it("renders Navbar on the home route (/)", () => {
    render(<App />);
    expect(screen.getByText("SHOPSMART")).toBeInTheDocument();
  });

  it("home route (/) renders Hero heading", () => {
    render(<App />);
    expect(screen.getByText(/stack your look loud/i)).toBeInTheDocument();
  });

  it('"About" desktop link points to /about', () => {
    render(<App />);
    const link = screen.getByRole("link", { name: /^about$/i });
    expect(link).toHaveAttribute("href", "/about");
  });

  it('"Blog" link points to /blog', () => {
    render(<App />);
    const link = screen.getByRole("link", { name: /^blog$/i });
    expect(link).toHaveAttribute("href", "/blog");
  });

  it('"FAQ" link points to /faq', () => {
    render(<App />);
    const link = screen.getByRole("link", { name: /^faq$/i });
    expect(link).toHaveAttribute("href", "/faq");
  });

  it('Shopping cart link points to /cart', () => {
    render(<App />);
    const cartLink = screen.getByRole("link", { name: /shopping cart/i });
    expect(cartLink).toHaveAttribute("href", "/cart");
  });

  it('logged-out account shortcut points to /login', () => {
    render(<App />);
    const loginLink = screen.getByRole("link", { name: /^log in$/i });
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it('"Clothing" category pill links to /collections', () => {
    render(<App />);
    const clothingLinks = screen.getAllByRole("link", { name: /^clothing$/i });
    expect(clothingLinks[0]).toHaveAttribute("href", "/collections");
  });

  it('"Shop now" hero link targets /collections', () => {
    render(<App />);
    expect(screen.getByRole("link", { name: /shop now/i })).toHaveAttribute(
      "href",
      "/collections",
    );
  });
});
