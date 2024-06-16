
export interface Guess {
    direction: "Up" | "Down";
    rate: string;
    timestamp: number;
  }
  
  export interface UserState {
    score: number;
    guess?: Guess;
  }


  
  export interface BitcoinRate {
    rate: string;
    timestamp: number;
  }