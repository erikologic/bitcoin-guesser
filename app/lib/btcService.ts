const options: RequestInit = {
  method: "GET",
  redirect: "follow",
  headers: {
    "Accept-Encoding": "gzip",
    Authorization: `Bearer ${process.env.COINCAP_API_KEY}`,
  },
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

export const fetchBitcoinPrice = async (): Promise<CoincapResponse> =>
  fetch(endpoint, options).then((r) => r.json());