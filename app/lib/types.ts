export type GuessDirection = "Up" | "Down";
export interface UnresolvedGuess extends BaseGuess {
  type: "unresolved";
}

export interface ResolvedGuess extends BaseGuess {
  type: "resolved" ;
  wasCorrect: boolean;
}

export interface BaseGuess {
  direction: GuessDirection;
  rate: string;
  timestamp: number;
}

export interface NewGameGuess {
  type: "new-game";
}

export type Guess = NewGameGuess | UnresolvedGuess | ResolvedGuess;

export interface UserState {
  score: number;
  guess: Guess;
}

export interface BitcoinRate {
  rate: string;
  timestamp: number;
}
