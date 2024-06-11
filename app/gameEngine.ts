type GuessType = "up" | "down";

interface Guess {
  type: GuessType;
  price: number;
  timestamp: number;
}

export class Game {
  constructor(
    private now: () => number,
    private priceGetter: () => Promise<number>,
    private guessGetter: () => Promise<Guess | null>,
    private guessPutter: (guess: Guess) => Promise<void>,
    private scoreGetter: () => Promise<number>,
    private scorePutter: (score: number) => Promise<void>
  ) {}

  async makeGuess(guess: GuessType): Promise<void> {
    return this.guessPutter({
      type: guess,
      price: await this.priceGetter(),
      timestamp: this.now(),
    });
  }

  

  async getScore(): Promise<number> {
    await this._resolveGuess();

    return this.scoreGetter();
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
