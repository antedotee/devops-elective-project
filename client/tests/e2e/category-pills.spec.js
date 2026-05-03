import { expect, test } from "@playwright/test";

test.describe("Category Pills", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
  });

  test("neo category pills are visible", async ({ page }) => {
    await expect(page.getByRole("link", { name: /^clothing$/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /new arrivals/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /^outerwear$/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /^denim$/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /^footwear$/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /^knits$/i }).first()).toBeVisible();
  });

  test('clicking "Denim" navigates with search query', async ({ page }) => {
    await page.getByRole("link", { name: /^denim$/i }).click();
    await expect(page).toHaveURL(/\/collections\?search=/);
  });
});
