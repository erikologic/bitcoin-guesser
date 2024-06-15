"use server";

import { fetchBitcoinPrice } from "./btcService";
import { putGuess } from "./game";

export const guess = async (direction: "Up" | "Down") => {
  // TODO rename to guess
  const btcPrice = await fetchBitcoinPrice();
  await putGuess(direction, btcPrice.data.rateUsd, btcPrice.timestamp);
};
