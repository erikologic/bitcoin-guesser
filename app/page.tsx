import { cookies } from "next/headers";
import { Button } from "./Button";
import { fetchBitcoinPrice } from "./coincap";
import { getState } from "./ddb";
import { Refresher } from "./Refresher";

export const revalidate = 3600 // revalidate the data at most every hour

export default async function Home() {
  const {score, guess, btcPrice, timestamp} = await getState()
  return (
    <>
      <Refresher />
      <header>
      <h1>Bitcoin Guesser</h1>
      </header>

      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div role="status" aria-label="Score">
          Current Score: {score}
        </div>
        <div role="status" aria-label="Price">
            BTC Price: ${btcPrice} <br />
            BTC time: {new Date(timestamp).toLocaleString()}
        </div>
        {guess ? <>
          <section role="status" aria-label="Guess">
            Your guess: {guess.direction} <br />
            Rate: {guess.rate} <br />
            Will resolve at: {new Date(guess.timestamp).toLocaleString()} <br />
          </section>
        </> : <>
          <Button direction="Up" />
          <Button direction="Down" />
        </>}
        
      </main>
    </>
    
  );
}
