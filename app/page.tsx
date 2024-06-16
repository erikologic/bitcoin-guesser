import { Button } from "./components/Button";
import { Refresher } from "./components/Refresher";
import { getState } from "./lib/game";

export default async function Home() {
  const {userState, btcRate} = await getState()
  
  return (
    <>
      <Refresher />
      <header>
      <h1>Bitcoin Guesser</h1>
      </header>

      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div role="status" aria-label="Score">
          Current Score: {userState.score}
        </div>
        <div role="status" aria-label="Price">
            BTC Price: ${btcRate.rate} <br />
            BTC time: {new Date(btcRate.timestamp).toLocaleString()}
        </div>
        {userState.guess.type === "unresolved" && <>
          <section role="status" aria-label="Guess">
            Your guess: {userState.guess.direction} <br />
            Rate: {userState.guess.rate} <br />
            Will resolve at: {new Date(userState.guess.timestamp).toLocaleString()} <br />
          </section>
        </>}
        {(userState.guess.type === "resolved" && userState.guess.wasCorrect) && <>
          <section role="status" aria-label="Guess">
            Good Job! Your guess was correct! <br />
          </section>
        </>}
        {(userState.guess.type === "resolved" && !userState.guess.wasCorrect) && <>
          <section role="status" aria-label="Guess">
            Oh snaps! Your guess was uncorrect! <br />
          </section>
        </>}
        {userState.guess.type !== "unresolved" ? <>
          <Button direction="Up" />
          <Button direction="Down" />
        </> : <div>Waiting for the guess to resolve...</div>}
        
      </main>
    </>
    
  );
}
