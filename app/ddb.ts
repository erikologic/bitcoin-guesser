import { cache } from "react";
import { Table } from "sst/node/table";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { cookies } from "next/headers";

const db = DynamoDBDocumentClient.from(
  new DynamoDBClient({ endpoint: "http://localhost:8000" })
);

export const getDDB = cache(async () => {
  const command = new QueryCommand({
    TableName: Table.scoreboard.tableName,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": "test",
    },
  });

  const results = await db.send(command);
  return results.Items?.[0].sk || "couldn't get from DDB";
});

export const getCurrentScore = cache(async () => {
  const id = cookies().get("id")?.value;
  if (!id) return 0;

  const command = new QueryCommand({
    TableName: Table.scoreboard.tableName,
    KeyConditionExpression: "pk = :pk AND sk = :sk",
    ExpressionAttributeValues: {
      ":pk": "currentScore",
      ":sk": id,
    },
  });

  const results = await db.send(command);
  return results.Items?.[0]?.sk ?? 0;
});
