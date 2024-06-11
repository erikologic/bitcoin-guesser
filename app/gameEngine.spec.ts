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

interface PriceEvent {
  type: "price";
  timestamp: Date;
  price: number;
}

function price(timestamp: Date, price: number): PriceEvent {
  return {
    type: "price",
    timestamp,
    price,
  };
}

type GameEvent = GuessEvent | PriceEvent;

function canPlayerMakeANewGuess(
  events: GameEvent[],
  timestamp?: Date
): boolean {
  timestamp ||= new Date();

  const guessEvents: GuessEvent[] = events
    .filter((e) => e.type === "guess")
    .sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    ) as GuessEvent[];

  if (guessEvents.length === 0) return true;

  const lastGuessHasNotResolved =
    guessEvents[0].timestamp.getTime() + RESOLVE_THRESHOLD_MS >
    timestamp.getTime();
  if (lastGuessHasNotResolved) return false;

  return true;
}

function getPlayerScore(events: GameEvent[]): number {
  let score = 0;
  if (events.length === 0) return score;

  throw new Error("Not implemented");
}

// @ts-ignore
const dt = (...o) => new Date(...o);

test("After a guess is entered the player cannot make new guesses until the existing guess is resolved", () => {
  const events = [guess(dt("2024-01-01 00:00:00"), "up")];
  expect(canPlayerMakeANewGuess(events, dt("2024-01-01 00:00:59"))).toBeFalsy();
  expect(
    canPlayerMakeANewGuess(events, dt("2024-01-01 00:01:00"))
  ).toBeTruthy();
});

test("Initially a player can guess", () => {
  const events: GameEvent[] = [];
  expect(
    canPlayerMakeANewGuess(events, dt("2024-01-01 00:01:00"))
  ).toBeTruthy();
});

test("The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made", () => {
  expect(getPlayerScore([])).toBe(0);

  const events = [
    price(dt("2024-01-01 00:00:00"), 10000),
    guess(dt("2024-01-01 00:00:00"), "up"),
    price(dt("2024-01-01 00:01:00"), 10001),
  ];

  expect(getPlayerScore(events)).toBe(1);
});


// Can't I just use last guess and last price???