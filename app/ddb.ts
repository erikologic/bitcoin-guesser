"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  QueryCommand,
  PutCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { cookies } from "next/headers";

const isLocal = process.env.LOCAL === "true";

const db = DynamoDBDocumentClient.from(
  new DynamoDBClient(
    isLocal
      ? {
          endpoint: "http://localhost:8000",
          credentials: {
            secretAccessKey: "DUMMY",
            accessKeyId: "DUMMY",
          },
          region: "eu-west-1",
        }
      : {}
  )
);

const TableName = isLocal
  ? "local-bitcoin-guesser-scoreboard"
  : "prod-bitcoin-guesser-scoreboard";

export const getDDB = async () => {
  const command = new QueryCommand({
    TableName,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": "test",
    },
  });

  const results = await db.send(command);
  return results.Items?.[0].sk || "couldn't get from DDB";
};

interface Guess {
  direction: "Up" | "Down";
  rate: string;
  timestamp: number;
}
interface State {
  score: number;
  guess?: Guess;
}
export const getState = async (): Promise<State> => {
  const id = cookies().get("id")?.value;
  console.log("cookies", cookies().get("id"));
  if (!id) return { score: 0, guess: undefined };

  const command = new QueryCommand({
    TableName,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": `user#${id}`,
    },
  });

  const results = await db.send(command);
  const score = results.Items?.find((item) => item.sk === "score")?.score || 0;
  const guess: Guess | undefined = results.Items?.filter(
    (item) => item.sk === "guess"
  )[0]?.data;
  return { score, guess };
};

export const putGuess = async (
  direction: "Up" | "Down",
  rate: string,
  timestamp: number
) => {
  const id = cookies().get("id")?.value;
  if (!id) throw new Error("This must not happen");

  const data: Guess = {
    direction,
    rate,
    timestamp,
  };

  const command = new PutCommand({
    TableName,
    Item: {
      pk: `user#${id}`,
      sk: "guess",
      data,
    },
  });
  await db.send(command);
};
