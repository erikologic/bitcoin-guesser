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

export const fetchBitcoinPrice = cache(
  async (): Promise<CoincapResponse> =>
    fetch("https://api.coincap.io/v2/rates/bitcoin", options).then((r) =>
      r.json()
    )
);
