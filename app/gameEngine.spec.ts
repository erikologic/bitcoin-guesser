// After a guess is entered the player cannot make new guesses until the existing guess is resolved
// The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
// If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user loses 1 point.
// Players can only make one guess at a time

type Guess = "up" | "down";

class Game {
  private guess: Guess | undefined;

  makeGuess(guess: Guess) {
    this.guess = guess;
  }

  getScore() {
    return 0;
  }

  getPrice() {
    return 1000;
  }

  canGuess() {
    return !this.guess;
  }
}

test("player can see their current score", () => {
  const game = new Game();
  expect(game.getScore()).toEqual(0);
});

test("player can see the latest available BTC price in USD", () => {
  const game = new Game();
  expect(game.getPrice()).toEqual(1000);
});

test("after a guess is entered the player cannot make new guesses until the existing guess is resolved", () => {
  const game = new Game();
  expect(game.canGuess()).toBeTruthy();
  game.makeGuess("up");
  expect(game.canGuess()).toBeFalsy();
});
