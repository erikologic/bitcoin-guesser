import Image from "next/image";
import { getDDB } from "./utils";

export const revalidate = 3600 // revalidate the data at most every hour

export default async function Home() {
  const ddbSays = await getDDB()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p className="">
          DDB says: {ddbSays}
        </p>
    </main>
  );
}
