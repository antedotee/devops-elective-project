import { expect, test } from "@playwright/test";

test.describe("Mocked API E2E", () => {
  test("mocked GET /api/products returns JSON and shell renders", async ({
    page,
  }) => {
    await page.route("**/api/products**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Mock T-Shirt",
            slug: "mock-tshirt",
            price_cents: 2999,
            category: "Tees",
            description: "Demo",
            image_url: "https://example.com/x.jpg",
          },
        ]),
      });
    });

    await page.goto("/collections");
    await expect(page.getByText("SHOPSMART")).toBeVisible();
    await expect(page.getByText("Mock T-Shirt")).toBeVisible();
  });

  test("home loads even when catalog mock fails", async ({ page }) => {
    await page.route("**/api/products**", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    await page.goto("/");
    await expect(page.getByText("SHOPSMART")).toBeVisible();
    await expect(page.locator("h1")).toContainText(/stack your look loud/i);
  });

  test("/cart renders empty cart messaging", async ({ page }) => {
    await page.goto("/cart");
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByText(/empty tote/i)).toBeVisible();
  });
});
