import { Duration } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { SSTConfig } from "sst";
import { NextjsSite, StackContext, Table } from "sst/constructs";

const github = {
  organization: "erikologic",
  repository: "bitcoin-guesser",
};

function IAM({ app, stack }: StackContext) {
  if (app.stage === "prod") {
    const provider = new iam.OpenIdConnectProvider(stack, "GitHub", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"],
    });

    new iam.Role(stack, "GitHubActionsRole", {
      assumedBy: new iam.OpenIdConnectPrincipal(provider).withConditions({
        StringLike: {
          "token.actions.githubusercontent.com:sub": `repo:${github.organization}/${github.repository}:*`,
        },
      }),
      description: "Role assumed for deploying from GitHub CI using AWS CDK",
      roleName: "GitHub", // Change this to match the role name in the GitHub workflow file
      maxSessionDuration: Duration.hours(1),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
      ],
    });
  }
}

export default {
  config(_input) {
    return {
      name: "bitcoin-guesser",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const table = new Table(stack, "scoreboard", {
        fields: {
          pk: "string",
          sk: "string",
        },
        primaryIndex: { partitionKey: "pk", sortKey: "sk" },
      });

      const site = new NextjsSite(stack, "site", {
        bind: [table],
        environment: { COINCAP_API_KEY: process.env.COINCAP_API_KEY! },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
    app.stack(IAM);
  },
} satisfies SSTConfig;
