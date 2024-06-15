import { cache } from "react";

interface CoincapResponse {
  data: {
    id: string;
    symbol: string;
    currencySymbol: string;
    type: string;
    rateUsd: string;
  };
  timestamp: number;
}
const options: RequestInit = {
  method: "GET",
  redirect: "follow",
  headers: {
    "Accept-Encoding": "gzip",
    Authorization: `Bearer ${process.env.COINCAP_API_KEY}`,
  },
};

if (!process.env.COINCAP_API_KEY) {
  throw new Error("COINCAP_API_KEY is not defined");
}

export const fetchBitcoinPrice = async () => ({
  data: {
    id: "bitcoin",
    symbol: "BTC",
    currencySymbol: "$",
    type: "crypto",
    rateUsd: "100000",
  },
  timestamp: Date.now(),
});
  // async (): Promise<CoincapResponse> =>
  //   fetch("https://api.coincap.io/v2/rates/bitcoin", options).then((r) =>
  //     r.json()
  //   )
