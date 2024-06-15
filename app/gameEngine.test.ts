// The player can choose to enter a guess of either “up” or “down“
// Players can only make one guess at a time
// After a guess is entered the player cannot make new guesses until the existing guess is resolved
// The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
// If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user loses 1 point.
const RESOLVE_THRESHOLD_MS = 60 * 1000;
interface GuessEvent {
  type: "guess";
  timestamp: Date;
  direction: "up" | "down";
}

function guess(timestamp: Date, direction: "up" | "down"): GuessEvent {
  return {
    type: "guess",
    timestamp,
    direction,
  };
}

type GameEvent = GuessEvent;

function canPlayerMakeANewGuess(
  events: GameEvent[],
  timestamp?: Date
): boolean {
  timestamp ||= new Date();

  const guessEvents: GuessEvent[] = events
    .filter((e) => e.type === "guess")
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  if (guessEvents.length === 0) return true;

  const lastGuessHasNotResolved =
    guessEvents[0].timestamp.getTime() + RESOLVE_THRESHOLD_MS > timestamp.getTime();
  if (lastGuessHasNotResolved) return false;

  return true;
}

// @ts-ignore
const dt = (...o) => new Date(...o);

test("After a guess is entered the player cannot make new guesses until the existing guess is resolved", () => {
  const events = [guess(dt("2024-01-01 00:00:00"), "up")];
  expect(canPlayerMakeANewGuess(events, dt("2024-01-01 00:00:59"))).toBeFalsy();
  expect(canPlayerMakeANewGuess(events, dt("2024-01-01 00:01:00"))).toBeTruthy();
});

test("Initially a player can guess", () => {
  const events: GameEvent[] = [];
  expect(canPlayerMakeANewGuess(events, dt("2024-01-01 00:01:00"))).toBeTruthy();
});
