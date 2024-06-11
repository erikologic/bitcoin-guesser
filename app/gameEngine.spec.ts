// The player can choose to enter a guess of either “up” or “down“
// After a guess is entered the player cannot make new guesses until the existing guess is resolved
// The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
// If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user loses 1 point.
// Players can only make one guess at a time
// New players start with a score of 0


function getGame() {
  return {
    getScore: () => 0,
    getPrice: () => 1000,
  };
}

test("player can see their current score", () => {
  const game = getGame();
  expect(game.getScore()).toEqual(0);
});

test("player can see the latest available BTC price in USD", () => {
  const game = getGame();
  expect(game.getPrice()).toEqual(1000);
})