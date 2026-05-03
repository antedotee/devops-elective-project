import { expect, test } from "@playwright/test";

test.describe("Responsive Design", () => {
  test("renders correctly on mobile viewport (375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByText("SHOPSMART")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
  });

  test("renders correctly on tablet viewport (768px)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await expect(page.getByText("SHOPSMART")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
  });

  test("renders correctly on desktop viewport (1440px)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.getByText("SHOPSMART")).toBeVisible();
    await expect(page.getByRole("link", { name: /^about$/i }).first()).toBeVisible();
  });

  test("shopping cart link is visible on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByRole("link", { name: /shopping cart/i })).toBeVisible();
  });
});
