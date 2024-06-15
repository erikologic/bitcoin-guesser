"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  QueryCommand,
  PutCommand,
  BatchWriteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { cookies } from "next/headers";
import { fetchBitcoinPrice } from "./btcService";

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

interface Guess {
  direction: "Up" | "Down";
  rate: string;
  timestamp: number;
}
interface State {
  score: number;
  guess?: Guess;
  btcPrice: string;
  timestamp: number;
}

const calcPoint = (
  direction: "Up" | "Down",
  rateAtGuessTime: number,
  currentRate: number
) => {
  const isGoodGuess =
    direction === "Up"
      ? currentRate > rateAtGuessTime
      : currentRate < rateAtGuessTime;
  return isGoodGuess ? 1 : -1;
};

export const getState = async (): Promise<State> => {
  const {
    timestamp,
    data: { rateUsd: btcPrice },
  } = await fetchBitcoinPrice();

  const id = cookies().get("id")?.value;
  if (!id)
    return {
      score: 0,
      guess: undefined,
      btcPrice,
      timestamp,
    };

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
  const state = { score, guess, btcPrice, timestamp };

  if (
    guess &&
    timestamp > guess.timestamp + 60_000 &&
    guess.rate !== btcPrice
  ) {
    const point = calcPoint(
      guess.direction,
      parseInt(guess.rate),
      parseInt(state.btcPrice)
    );
    const newScore = state.score + point;
    state.score = newScore;
    delete state.guess;

    const command = new BatchWriteCommand({
      RequestItems: {
        [TableName]: [
          {
            PutRequest: {
              Item: {
                pk: `user#${id}`,
                sk: "guess",
                data: undefined,
              },
            },
          },
          {
            PutRequest: {
              Item: {
                pk: `user#${id}`,
                sk: "score",
                score: newScore,
              },
            },
          },
        ],
      },
    });
    await db.send(command);
  }
  return state;
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
