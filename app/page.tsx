import { Button } from "./components/Button";
import { Refresher } from "./components/Refresher";
import { getState } from "./lib/game";

import { Andika, Roboto_Mono } from "next/font/google";

const andika = Andika({
  subsets: ['latin'],
  display: 'swap',
  weight: '700',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
})

const formatRate = (rate: string) => parseFloat(rate).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")

export default async function Home() {
  const {userState, btcRate} = await getState()
  return (
    <>
      <Refresher />
      <header className="flex justify-center">
        <h1 className={`${andika.className} uppercase text-4xl text-yellow-300 py-6`}>Bitcoin Guesser</h1>
      </header>

      <main className="flex min-h-screen flex-col items-center justify-start">
        <div role="status" aria-label="Price" className="flex flex-col items-center pb-6">
            <div><span className="text-2xl">$ {formatRate(btcRate.rate)}</span></div>
            <div className={`${robotoMono.className} uppercase text-xs text-blue-300 pt-2`}>
              {new Date(btcRate.timestamp).toISOString()}
            </div>
        </div>
        <div role="status" aria-label="Score">
          Current Score: {userState.score}
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
