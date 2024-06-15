"use server";

import { fetchBitcoinPrice } from "./coincap";
import { putGuess } from "./game";

export const vote = async (direction: "Up" | "Down") => {
  // TODO rename to guess
  const btcPrice = await fetchBitcoinPrice();
  await putGuess(direction, btcPrice.data.rateUsd, btcPrice.timestamp);
};
