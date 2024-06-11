// The player can choose to enter a guess of either “up” or “down“
// After a guess is entered the player cannot make new guesses until the existing guess is resolved
// The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
// If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user loses 1 point.
// Players can only make one guess at a time
// New players start with a score of 0


interface GameState {
  score: {
    points: number;
  };
  price: {
    value: number;
  };
}
function processState(state: GameState): GameState {
  return state;
}

describe("Game Engine", () => {
  test("The player can at all times see their current score", () => {
    const state: Partial<GameState> = {
      score: {
        points: 0,
      },
    };
    expect(processState(state as GameState).score.points).toEqual(0);
  });

  test("The player can at all times see the latest available BTC price in USD", () => {
    const state: Partial<GameState> = {
      score: {
        points: 0,
      },
      price: {
        value: 1000
      }
    };
    expect(processState(state as GameState).price.value).toEqual(1000);
  });
});
