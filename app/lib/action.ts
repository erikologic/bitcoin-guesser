"use server";

import { fetchBitcoinPrice } from "./btcService";
import { putGuess } from "./game";

export const guess = async (direction: "Up" | "Down") => {
  const btcPrice = await fetchBitcoinPrice();
  await putGuess(direction, btcPrice.data.rateUsd, btcPrice.timestamp);
};
