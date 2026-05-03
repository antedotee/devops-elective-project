import { expect, test } from "@playwright/test";

test.describe("Navigation Links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test('clicking "About" navigates to /about', async ({ page }) => {
    await page.getByRole("link", { name: /^about$/i }).click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByText(/about us page/i)).toBeVisible();
  });

  test('clicking "Blog" navigates to /blog', async ({ page }) => {
    await page.getByRole("link", { name: /^blog$/i }).click();
    await expect(page).toHaveURL(/\/blog/);
    await expect(page.getByText(/blog page/i)).toBeVisible();
  });

  test('clicking "FAQ" navigates to /faq', async ({ page }) => {
    await page.getByRole("link", { name: /^faq$/i }).click();
    await expect(page).toHaveURL(/\/faq/);
    await expect(page.getByText(/faq page/i)).toBeVisible();
  });

  test("clicking SHOPSMART logo returns to home (/)", async ({ page }) => {
    await page.goto("/about");
    await page.getByText("SHOPSMART").click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("h1")).toContainText(/stack your look loud/i);
  });

  test("cart icon navigates to /cart", async ({ page }) => {
    await page.getByRole("link", { name: /shopping cart/i }).click();
    await expect(page).toHaveURL(/\/cart/);
  });

  test("account icon navigates to /login when logged out", async ({
    page,
  }) => {
    await page.getByRole("link", { name: /^log in$/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('clicking "Clothing" navigates to /collections', async ({ page }) => {
    await page.getByRole("link", { name: /^clothing$/i }).first().click();
    await expect(page).toHaveURL(/\/collections/);
  });

  test('clicking "New arrivals" navigates with search query', async ({
    page,
  }) => {
    await page.getByRole("link", { name: /new arrivals/i }).click();
    await expect(page).toHaveURL(/search=/);
  });
});
