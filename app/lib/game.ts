"use server";

import { fetchBitcoinRate } from "./btcService";
import { getUserState, putGuess, putUserState } from "./dynamoDb";
import { cookies } from "next/headers";
import { BitcoinRate, GuessDirection, UserState } from "./types";

const RESOLVE_WAIT_TIME = 60_000;

const calcPoint = (
  direction: GuessDirection,
  rateAtGuessTime: number,
  currentRate: number
) => {
  const isGoodGuess =
    direction === "Up"
      ? currentRate > rateAtGuessTime
      : currentRate < rateAtGuessTime;
  return isGoodGuess ? 1 : -1;
};

export const guess = async (direction: GuessDirection) => {
  const btcRate = await fetchBitcoinRate();
  await putGuess(direction, btcRate.rate, btcRate.timestamp);
};

const initialUserState: UserState = {
  score: 0,
  guess: {
    type: "new-game",
  },
};

interface GetState {
  userState: UserState;
  btcRate: BitcoinRate;
}

export const getState = async (): Promise<GetState> => {
  const btcRate = await fetchBitcoinRate();

  const id = cookies().get("id")?.value;
  if (!id)
    return {
      userState: initialUserState,
      btcRate,
    };

  let userState = await getUserState(id);

  if (
    userState.guess?.type === "unresolved" &&
    btcRate.timestamp > userState.guess.timestamp + RESOLVE_WAIT_TIME &&
    btcRate.rate !== userState.guess.rate
  ) {
    const point = calcPoint(
      userState.guess.direction,
      parseFloat(userState.guess.rate),
      parseFloat(btcRate.rate)
    );
    userState = {
      score: userState.score + point,
      guess: {
        ...userState.guess,
        type: "resolved",
        wasCorrect: point > 0,
      },
    };

    await putUserState(id, userState);
  }
  return { userState, btcRate };
};
