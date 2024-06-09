import { cache } from "react";
import { Table } from "sst/node/table";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const getDDB = cache(async () => {
  const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

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
