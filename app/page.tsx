import Image from "next/image";

import { Button } from "./components/Button";
import { Refresher } from "./components/Refresher";
import { getState } from "./lib/game";

import { Andika, Roboto_Mono } from "next/font/google";
import { UnresolvedGuess } from "./components/UnresolvedGuess";

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

export const formatRate = (rate: string) => "$ " + parseFloat(rate).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")

export default async function Home() {
  const {userState, btcRate} = await getState()

  return (
    <>
      <Refresher />
      <header className="flex flex-col justify-center items-center pt-6 ">
        <h1 className={`${andika.className} uppercase text-4xl text-orange-300 pb-5 `}>Bitcoin Guesser</h1>
        <hr className="w-2/5 border-gray-700 mt-1 mb-5" />
      </header>
      
      <main className="flex min-h-screen flex-col items-center justify-start">
        <div role="status" aria-label="Price" className="flex flex-col items-center pb-2">
            <div className="flex">
              <Image
                  src="/bitcoin.svg"
                  alt="Bitcoin Logo"
                  width={30}
                  height={24}
                  priority
                />
              <div className="ml-2 text-2xl">{formatRate(btcRate.rate)}</div>
            </div>
            <div className={`${robotoMono.className} uppercase text-xs text-orange-200 pt-2`}>
              {new Date(btcRate.timestamp).toISOString()}
            </div>
        </div>

        <hr className="w-2/5 border-gray-700 my-4" />

        <div role="status" aria-label="Score">
          Your Score: {userState.score}
        </div>
        <hr className="w-2/5 border-gray-700 my-4" />

        {userState.guess.type === "unresolved" && <UnresolvedGuess guess={userState.guess} />}
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
        {userState.guess.type !== "unresolved" &&
          <div className="flex flex-col items-center">
            <h2>Guess where is going to move next?</h2>
            <div className="flex justify-between space-x-4 mt-2">
              <Button direction="Down" />
              <Button direction="Up" />
            </div>
          </div>
        }
        
      </main>
    </>
    
  );
}
