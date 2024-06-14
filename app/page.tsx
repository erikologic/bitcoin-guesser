import { getScore, getBtc, voteUp, getState } from './actions';

export default async function Home() {
  const score = await getScore();
  const btc = await getBtc();
  const state = await getState();
  console.log(state)
  return (
    <>
    <header>
      <h1>Bitcoin Guesser</h1>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div role="status" aria-label="Score">
          Current Score: {score}
        </div>
        <div role="status" aria-label="Price">
            BTC Price: ${btc}
        </div>
        {state === 'guessing' ? <div>Waiting for the guess to be resolved</div> : 
        <>
        <button aria-label="up" onClick={async () => {
          await voteUp();

          }}>Up</button>
        <button aria-label="down">Down</button>
        </>
        }
        
      </main>
    </>
    
  );
}
