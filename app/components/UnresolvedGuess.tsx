import { UnresolvedGuess as IUnresolvedGuess } from "../lib/types";
import { formatRate } from "../lib/utils";
import { ArrowUp, ArrowDown } from "./Arrow";

export const UnresolvedGuess = ({ guess }: { guess: IUnresolvedGuess; }) => {
  const remainingSecs = Math.floor(((guess.timestamp + 60_000) - Date.now()) / 1000);
  const isUp = guess.direction === 'Up';

  return <section role="status" aria-label="Guess" className="flex flex-col items-center">
    <h2 className="mb-2">You have guessed!</h2>
    <div className={isUp ? "text-green-300" : "text-red-300"}>
      {formatRate(guess.rate)} {isUp ? <ArrowUp /> : <ArrowDown />} in {remainingSecs} secs
    </div>
    <div className="text-xs">You guessed the BTC price will go {guess.direction.toLocaleLowerCase()} at expiry time </div>
  </section>;
};
