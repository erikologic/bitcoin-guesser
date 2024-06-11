
// Players can only make one guess at a time

import { Game } from "./gameEngine";

describe("Game", () => {
  const now = jest.fn();
  const priceGetter = jest.fn();
  const guessGetter = jest.fn();
  const guessPutter = jest.fn();
  const scoreGetter = jest.fn();
  const scorePutter = jest.fn();

  const game = new Game(
    now,
    priceGetter,
    guessGetter,
    guessPutter,
    scoreGetter,
    scorePutter
  );

  beforeEach(() => {
    now.mockImplementation(() => 0);
    priceGetter.mockResolvedValue(1000);
    guessGetter.mockResolvedValue(null);
    guessPutter.mockImplementation(async (guess) => {
      guessGetter.mockResolvedValue(guess);
    });
    scoreGetter.mockResolvedValue(0);
    scorePutter.mockImplementation(async (score) => {
      scoreGetter.mockResolvedValue(score);
    });
  });

  test("player can see their current score", async () => {
    await expect(game.getScore()).resolves.toEqual(0);
  });

  test("player can see the latest available BTC price in USD", async () => {
    await expect(game.getPrice()).resolves.toEqual(1000);
  });

  test("The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made", async () => {
    await expect(game.canGuess()).resolves.toBeTruthy();
    await game.makeGuess("up");
    await expect(game.canGuess()).resolves.toBeFalsy();

    now.mockImplementation(() => 60_000);
    priceGetter.mockResolvedValue(1001);

    await expect(game.canGuess()).resolves.toBeTruthy();
  });

  // If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. 
  test("If the guess is correct, the user gets 1 point added to their score", async () => {
    await game.makeGuess("up");

    now.mockImplementation(() => 60_000);
    priceGetter.mockResolvedValue(1001);
    await expect(game.getScore()).resolves.toEqual(1);

    await game.makeGuess("down");
    now.mockImplementation(() => 60_000);
    priceGetter.mockResolvedValue(1001);
    await expect(game.getScore()).resolves.toEqual(1);
  });
  
  // If the guess is incorrect, the user loses 1 point.
});
