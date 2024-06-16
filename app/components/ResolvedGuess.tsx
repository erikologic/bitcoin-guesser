import { ResolvedGuess as IResolvedGuess } from "../lib/types";

export const ResolvedGuess = ({ guess }: { guess: IResolvedGuess; }) => {
  return <section role="status" aria-label="Guess" className="flex flex-col items-center">
    {guess.wasCorrect ?
      <>
        <div>
          <span role="img" aria-label="celebrate">🎉🎉🎉</span>
          &nbsp;Good Job!
        </div>
        <div>Your guess was correct! </div>
        <div>Was it luck or talent!? </div>
      </> :
      <>
        <div>
          <span role="img" aria-label="sorry">😥😥😥</span>
          &nbsp;Oh snaps!</div>
        <div>Your guess was not correct! </div>
        <div>You might be lucky next time! </div>
      </>}
  </section>;
};
