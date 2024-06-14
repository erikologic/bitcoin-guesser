import { getState } from "./state";

export const revalidate = 3600 // revalidate the data at most every hour

export default async function Home() {
  const state = await getState();
  return (
    <>
    <header>
      <h1>Bitcoin Guesser</h1>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div role="status" aria-label="Score">
          Current Score: {state.score.current}
        </div>
        <div role="status" aria-label="Price">
            BTC Price: ${state.btc.rateUsd}
        </div>
        <button aria-label="up">Up</button>
        <button aria-label="down">Down</button>
      </main>
    </>
    
  );
}
