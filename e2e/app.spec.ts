import { test, expect } from "@playwright/test";

const setBitcoin = (payload: any) =>
  fetch("http://localhost:9000/bitcoin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

test("the app", async ({ page, browser }) => {
  // WHEN a new player visits the site
  await page.goto("/");

  // THEN they can see the website
  await expect(page).toHaveTitle(/Bitcoin Guesser/);

  // AND their score will be 0
  await expect(
    page.getByRole("status", { name: "Score" }).getByText("0")
  ).toBeVisible();

  // AND they can see the current BTC price
  await setBitcoin({ data: { rateUsd: "100000" }, timestamp: null });
  await expect(
    page.getByRole("status", { name: "Price" }).getByText("100000")
  ).toBeVisible();

  // AND the player can make a guess if the price will go up or down
  await expect(page.getByRole("button", { name: "Up" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Down" })).toBeEnabled();

  // GIVEN the price updates
  await setBitcoin({ data: { rateUsd: "99" } });

  // THEN they can see the current BTC price
  await expect(
    page.getByRole("status", { name: "Price" }).getByText("99")
  ).toBeVisible();

  // GIVEN the player makes a guess
  await page.getByRole("button", { name: "Up" }).click();

  // THEN the player cannot make a new guess
  await expect(page.getByRole("button", { name: "Up" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Down" })).not.toBeVisible();

  // AND they will be told the guess that they made
  await expect(page.getByRole("status", { name: "Guess" }).getByText("Up")).toBeVisible();
  await expect(page.getByRole("status", { name: "Guess" }).getByText("99")).toBeVisible();

  // WHEN 60 seconds have passed since the guess was made but the price hasn't changed
  await setBitcoin({
    timestamp: Date.now() + 61_000,
  });

  // THEN the player cannot make a new guess
  await expect(page.getByRole("button", { name: "Up" })).not.toBeVisible();

  // WHEN the price finally changes
  await setBitcoin({
    data: { rateUsd: "1000" },
  });

  // THEN the player will be told they were correct
  await expect(page.getByRole("status", { name: "Guess" }).getByText("Good Job!")).toBeVisible();

  // AND their score will be 1
  await expect(
    page.getByRole("status", { name: "Score" }).getByText("1")
  ).toBeVisible();  

  // AND the player can make a new guess
  await expect(page.getByRole("button", { name: "Up" })).toBeVisible();

  // WHEN the user refreshes the page
  await page.reload();

  // THEN the score will be 1
  await expect(
    page.getByRole("status", { name: "Score" }).getByText("1")
  ).toBeVisible();

  // GIVEN a new player open the website
  const context = await browser.newContext();
  const player2page = await context.newPage();
  await player2page.goto("/");

  // THEN they can see the website
  await expect(player2page).toHaveTitle(/Bitcoin Guesser/);

  // AND their score will be 0
  await expect(
    player2page.getByRole("status", { name: "Score" }).getByText("0")
  ).toBeVisible();

  // AND player 1 score is still 1
  await expect(
    page.getByRole("status", { name: "Score" }).getByText("1")
  ).toBeVisible();
});
