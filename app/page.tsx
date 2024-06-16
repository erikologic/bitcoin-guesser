import Image from "next/image";

import { Button } from "./components/Button";
import { Refresher } from "./components/Refresher";
import { getState } from "./lib/game";

import { Andika, Roboto_Mono } from "next/font/google";
import { UnresolvedGuess } from "./components/UnresolvedGuess";
import { ResolvedGuess } from "./components/ResolvedGuess";
import { formatRate } from "./lib/utils";

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

export default async function Home() {
  const {userState, btcRate} = await getState();

  return (
    <>
      <Refresher />
      <header className="flex flex-col justify-center items-center mt-6 ">
        <h1 className={`${andika.className} uppercase text-4xl text-orange-300 m3-4`}>Bitcoin Guesser</h1>
        <p className="text-sm mb-5 mx-6">Guess how the BTC price will move in the next 60 secs!</p>
        <hr className="w-2/5 border-gray-700 mb-5" />
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
        {(userState.guess.type === "resolved") && 
          <>
            <ResolvedGuess guess={userState.guess} />
            <hr className="w-2/5 border-gray-700 my-4" />
          </>
        }  
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
