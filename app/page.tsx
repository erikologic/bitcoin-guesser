import { fetchBitcoinPrice } from "./coincap";
import { getCurrentScore } from "./ddb";

export const revalidate = 3600 // revalidate the data at most every hour

export default async function Home() {
  const currentScore = await getCurrentScore()
  const btc = await fetchBitcoinPrice();
  return (
    <>
    <header>
      <h1>Bitcoin Guesser</h1>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div role="status" aria-label="Score">
          Current Score: {currentScore}
        </div>
        <div role="status" aria-label="Price">
            BTC Price: ${btc.data.rateUsd}
        </div>
      </main>
    </>
    
  );
}
