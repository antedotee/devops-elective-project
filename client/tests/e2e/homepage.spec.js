import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads successfully and shows hero heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText(/stack your look loud/i);
  });

  test("Navbar is visible with SHOPSMART logo", async ({ page }) => {
    await expect(page.getByText("SHOPSMART")).toBeVisible();
  });

  test("Shop now hero link is visible", async ({ page }) => {
    await expect(page.getByRole("link", { name: /shop now/i })).toBeVisible();
  });

  test("page title is set (not blank)", async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});
