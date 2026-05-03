import { expect, test } from "@playwright/test";

test.describe("Search Bar", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
  });

  test('search input is visible with placeholder "Search gear"', async ({ page }) => {
    const input = page.getByPlaceholder(/search gear/i);
    await expect(input).toBeVisible();
  });

  test("typing in search updates input value", async ({ page }) => {
    const input = page.getByPlaceholder(/search gear/i);
    await input.fill("jeans");
    await expect(input).toHaveValue("jeans");
  });

  test("search input accepts special characters", async ({ page }) => {
    const input = page.getByPlaceholder(/search gear/i);
    await input.fill("Kid's wear");
    await expect(input).toHaveValue("Kid's wear");
  });

  test("search input can be cleared", async ({ page }) => {
    const input = page.getByPlaceholder(/search gear/i);
    await input.fill("sweater");
    await input.clear();
    await expect(input).toHaveValue("");
  });
});
