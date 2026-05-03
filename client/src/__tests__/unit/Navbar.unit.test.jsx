import { render, screen } from "@testing-library/react";
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

describe("Navbar — Unit Tests", () => {
  it("renders SHOPSMART logo text", () => {
    renderNavbar();
    expect(screen.getByText("SHOPSMART")).toBeInTheDocument();
  });

  it('logo links to the home route "/"', () => {
    renderNavbar();
    const logo = screen.getByText("SHOPSMART").closest("a");
    expect(logo).toHaveAttribute("href", "/");
  });

  it('desktop "About" nav link uses /about', () => {
    renderNavbar();
    const link = screen.getByRole("link", { name: /^about$/i });
    expect(link).toHaveAttribute("href", "/about");
  });

  it('desktop "Blog" nav link uses /blog', () => {
    renderNavbar();
    const link = screen.getByRole("link", { name: /^blog$/i });
    expect(link).toHaveAttribute("href", "/blog");
  });

  it('desktop "FAQ" nav link uses /faq', () => {
    renderNavbar();
    const link = screen.getByRole("link", { name: /^faq$/i });
    expect(link).toHaveAttribute("href", "/faq");
  });

  it('search input uses placeholder "Search gear..."', () => {
    renderNavbar();
    expect(screen.getByPlaceholderText(/search gear/i)).toBeInTheDocument();
  });

  it('cart link points to "/cart"', () => {
    renderNavbar();
    const cartLink = screen.getByRole("link", { name: /shopping cart/i });
    expect(cartLink).toHaveAttribute("href", "/cart");
  });

  it('logged-out account link goes to "/login"', () => {
    renderNavbar();
    const account = screen.getByRole("link", { name: /^log in$/i });
    expect(account).toHaveAttribute("href", "/login");
  });

  it("renders category pills including New arrivals", () => {
    renderNavbar();
    expect(screen.getByText(/new arrivals/i)).toBeInTheDocument();
    expect(screen.getByText(/outerwear/i)).toBeInTheDocument();
  });
});
