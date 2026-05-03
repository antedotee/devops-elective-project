import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Hero from "../../components/Hero";

describe("Hero — Unit Tests", () => {
  it('renders the main heading "Stack your look loud"', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );
    expect(screen.getByText(/stack your look loud/i)).toBeInTheDocument();
  });

  it('renders the "Shop now" link to collections', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );
    const shop = screen.getByRole("link", { name: /shop now/i });
    expect(shop).toHaveAttribute("href", "/collections");
  });

  it("renders register CTA link", () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: /create account/i })).toHaveAttribute(
      "href",
      "/register",
    );
  });

  it("renders category shortcut tiles linking to filtered shop", () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("link", { name: /outer layers/i }),
    ).toHaveAttribute("href", "/collections?search=outerwear");
  });
});
