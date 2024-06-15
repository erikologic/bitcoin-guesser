import { test, expect } from "@playwright/test";

const setBitcoin = (payload: any) =>
  fetch("http://localhost:9000/bitcoin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

test("the app", async ({ page }) => {
  // WHEN a new player visits the site
  await page.goto("/");

  // THEN they can see the website
  await expect(page).toHaveTitle(/Bitcoin Guesser/);

  // AND their score will be 0
  await expect(
    page.getByRole("status", { name: "Score" }).getByText("0")
  ).toBeVisible();

  // AND they can see the current BTC price
  await setBitcoin({ data: { rateUsd: "100000" } });
  await expect(
    page.getByRole("status", { name: "Price" }).getByText("100000")
  ).toBeVisible();

  // GIVEN the price updates
  await setBitcoin({ data: { rateUsd: "99" } });

  // THEN they can see the current BTC price
  await expect(
    page.getByRole("status", { name: "Price" }).getByText("99")
  ).toBeVisible();

  // The player can choose to enter a guess of either “up” or “down“
  await expect(page.getByRole("button", { name: "up" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "down" })).toBeEnabled();

  // Players can only make one guess at a time
  // After a guess is entered the player cannot make new guesses until the existing guess is resolved
  // The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
  // If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user loses 1 point.
});
