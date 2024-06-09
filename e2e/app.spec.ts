import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Bitcoin Guesser/);
  await expect(page.getByText("hello world from DDB")).toBeVisible(); // This is a temp item I manually added to the table
});
