import { cookies } from "next/headers";
import { Button } from "./Button";
import { fetchBitcoinPrice } from "./coincap";
import { getState } from "./ddb";
import { Refresher } from "./Refresher";

export const revalidate = 3600 // revalidate the data at most every hour

export default async function Home() {
  const {score, guess} = await getState()
  const btc = await fetchBitcoinPrice();
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
            BTC Price: ${btc.data.rateUsd} <br />
            BTC time: {new Date(btc.timestamp).toLocaleString()}
        </div>
        {guess ? <></> : <>
          <Button direction="Up" />
          <Button direction="Down" />
        </>}
        
      </main>
    </>
    
  );
}
