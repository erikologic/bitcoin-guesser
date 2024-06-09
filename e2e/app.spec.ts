import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Bitcoin Guesser/);
  await expect(page.getByText("hello world from DDB")).toBeVisible(); // This is a temp item I manually added to the table

  // New players start with a score of 0
  // The player can at all times see their current score and the latest available BTC price in USD
  // Players can only make one guess at a time
  // The player can choose to enter a guess of either “up” or “down“
  // After a guess is entered the player cannot make new guesses until the existing guess is resolved
  // The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
  // If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user loses 1 point.
});
