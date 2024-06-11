// After a guess is entered the player cannot make new guesses until the existing guess is resolved
// The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
// If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user loses 1 point.
// Players can only make one guess at a time

type GuessType = "up" | "down";

interface Guess {
  type: GuessType;
  price: number;
  timestamp: number;
}
class Game {
  constructor(
    private now: () => number,
    private priceGetter: () => Promise<number>,
    private guessGetter: () => Promise<Guess | null>,
    private guessPutter: (guess: Guess) => void
  ) {}

  async makeGuess(guess: GuessType): Promise<void> {
    await this.guessPutter({
      type: guess,
      price: await this.priceGetter(),
      timestamp: this.now(),
    });
  }

  getScore(): number {
    return 0;
  }

  getPrice(): Promise<number> {
    return this.priceGetter();
  }

  async canGuess(): Promise<boolean> {
    const guess = await this.guessGetter();

    if (!guess) return true;

    const current = this.now();
    if (current - guess.timestamp < 60_000) return false;

    const price = await this.priceGetter();
    if (price === guess.price) return false; // TODO trigger a price update

    return true;
  }
}

// TODO go repo here too
test("player can see their current score", () => {
  const now = jest.fn(() => 0);
  const priceGetter = jest.fn().mockResolvedValue(1000);
  const guessGetter = jest.fn().mockResolvedValue(null);
  const guessPutter = jest.fn(async (guess) => {
    guessGetter.mockResolvedValue(guess);
  });

  const game = new Game(now, priceGetter, guessGetter, guessPutter);

  expect(game.getScore()).toEqual(0);
});

test("player can see the latest available BTC price in USD", async () => {
  const now = jest.fn(() => 0);
  const priceGetter = jest.fn().mockResolvedValue(1000);
  const guessGetter = jest.fn().mockResolvedValue(null);
  const guessPutter = jest.fn(async (guess) => {
    guessGetter.mockResolvedValue(guess);
  });

  const game = new Game(now, priceGetter, guessGetter, guessPutter);

  await expect(game.getPrice()).resolves.toEqual(1000);
});

test("The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made", async () => {
  const now = jest.fn(() => 0);
  const priceGetter = jest.fn().mockResolvedValue(1000);
  const guessGetter = jest.fn().mockResolvedValue(null);
  const guessPutter = jest.fn(async (guess) => {
    guessGetter.mockResolvedValue(guess);
  });

  const game = new Game(now, priceGetter, guessGetter, guessPutter);

  await expect(game.canGuess()).resolves.toBeTruthy();
  await game.makeGuess("up");
  await expect(game.canGuess()).resolves.toBeFalsy();

  now.mockImplementation(() => 60_000);
  priceGetter.mockResolvedValue(1001);

  await expect(game.canGuess()).resolves.toBeTruthy();
});
