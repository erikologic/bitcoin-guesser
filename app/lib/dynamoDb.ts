"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  QueryCommand,
  PutCommand,
  BatchWriteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { cookies } from "next/headers";
import { Guess, UserState } from "./types";

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

export const getUserState = async (id: string): Promise<UserState> => {
  const command = new QueryCommand({
    TableName,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": `user#${id}`,
    },
  });

  const results = await db.send(command);
  const score: number =
    results.Items?.find((item) => item.sk === "score")?.score || 0;
  const guess: Guess | undefined = results.Items?.filter(
    (item) => item.sk === "guess"
  )[0]?.data;
  return { score, guess };
};

export const putUserState = async (id: string, { score, guess }: UserState) => {
  const command = new BatchWriteCommand({
    RequestItems: {
      [TableName]: [
        {
          PutRequest: {
            Item: {
              pk: `user#${id}`,
              sk: "guess",
              data: guess,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              pk: `user#${id}`,
              sk: "score",
              score,
            },
          },
        },
      ],
    },
  });
  await db.send(command);
};

export const putGuess = async (
  direction: "Up" | "Down",
  rate: string,
  timestamp: number
) => {
  const id = cookies().get("id")?.value;
  if (!id)
    throw new Error(
      "Don't want to support browsers that can't handle cookies for now"
    );

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
