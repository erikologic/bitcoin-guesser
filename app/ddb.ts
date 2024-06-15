import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
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

export const getCurrentScore = async () => {
  const id = cookies().get("id")?.value;
  if (!id) return 0;

  const command = new QueryCommand({
    TableName,
    KeyConditionExpression: "pk = :pk AND sk = :sk",
    ExpressionAttributeValues: {
      ":pk": "currentScore",
      ":sk": id,
    },
  });

  const results = await db.send(command);
  return results.Items?.[0]?.sk ?? 0;
};
