import { getDDB } from "./utils";
import { fetchBitcoinPrice } from "./coincap";

export const revalidate = 3600 // revalidate the data at most every hour

export default async function Home() {
  const ddbSays = await getDDB()
  const btc = await fetchBitcoinPrice();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p className="">
          DDB says: {ddbSays}
          Bro: {btc.data.rateUsd}
        </p>
    </main>
  );
}
