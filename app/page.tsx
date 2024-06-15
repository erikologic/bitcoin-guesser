import { fetchBitcoinPrice } from "./coincap";
import { getCurrentScore } from "./ddb";
import { Price } from "./Price";

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
        <Price price={btc.data.rateUsd} />  
        <button aria-label="up">Up</button>
        <button aria-label="down">Down</button>
      </main>
    </>
    
  );
}
