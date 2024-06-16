import { BitcoinRate } from "./types";

const options: RequestInit = {
  method: "GET",
  redirect: "follow",
  headers: {
    "Accept-Encoding": "gzip",
    Authorization: `Bearer ${process.env.COINCAP_API_KEY}`,
  },
  cache: "no-store",
};

const endpoint =
  process.env.LOCAL === "true"
    ? "http://localhost:9000/bitcoin"
    : "https://api.coincap.io/v2/rates/bitcoin";

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

export const fetchBitcoinRate = async (): Promise<BitcoinRate> =>
  fetch(endpoint, options)
    .then((r) => r.json())
    .then((r: CoincapResponse) => ({
      timestamp: r.timestamp,
      rate: r.data.rateUsd,
    }));
