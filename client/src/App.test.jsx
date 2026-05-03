import { render, screen } from "@testing-library/react";
import App from "./App";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("App", () => {
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

  it("renders SHOPSMART title", () => {
    render(<App />);
    expect(screen.getByText(/SHOPSMART/i)).toBeInTheDocument();
  });
});
