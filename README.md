# Bitcoin Guesser

A web app that allows users to make guesses on whether the market price of Bitcoin (BTC/USD) will be higher or lower after one minute.

## Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Playwright
- AWS (Cloudfront, Lambda, DDB) + SST (Serverless Stack Toolkit)
- CoinCap API
- GitHub Actions
- Codespace

## Onboarding

To get started with the project, follow these steps:

Codespace:

- Fork this repository.
- Start a Codespace on the repository (you may need to increase the vCPUs).

Local:

- Clone this repository.
- Install the dependencies with `npm install && npx playwright install --with-deps`.

## Local Development

To run the project locally, follow these steps:

- Run `npm run dev:local` to start all the development servers...
- ...or run each server in its own terminal:
  - `npm run dev:local-next`: Run Next.js for local use.
  - `npm run dev:local-ddb`: Run DynamoDB Local.
  - `npm run dev:local-btc`: Run the BTC price server simulator.
- Open [http://localhost:3000](http://localhost:3000) in your browser to see the local web app.
- Run `test:e2e:ui` to run the Playwright tests locally.

Notes:

- `test:unit` would run Jest, but there are no unit tests - only E2E.
- When DynamoDB Local is stopped, the database content is lost.
- The BTC price simulator is an Express server.  
It could have been a bit smarter, such as being able to track each browser independently, but its implementation is sufficient for now.  
It has 2 endpoints:
  - `GET /bitcoin`: Returns the current price of Bitcoin, with the same payload as the CoinCap API.
  - `POST /bitcoin`: Reads a `Partial<CoinCapResponse>` and merges it with the "store" content, allowing changing the GET endpoint behavior.  

## Remote Development

To run the app with the real DynamoDB and CoinCap API, use the following command:

```bash
npm run dev
```

This command requires setting up the right environment variables:

```bash
export AWS_ACCESS_KEY_ID=AKIAxxxxx
export AWS_SECRET_ACCESS_KEY=xxxx
export AWS_DEFAULT_REGION=eu-west-1
export COINCAP_API_KEY="-----BEGIN EC PRIVATE KEY-----\nxxxxxxxxxx-----END EC PRIVATE KEY-----\n"
```

Note: I usually work in Enterprise AWS environments with SSO and multiple accounts. My usual "assume credentials" pattern involves using `aws-sso-login`. However, this approach does not work in a Codespace environment. Exporting hardcoded credentials is a suboptimal solution, and if you have a better way to assume roles, it should work but is not tested.

## CI/CD

The SST stack includes setting up the AWS IAM Identity Provider and Role so that GitHub Actions can assume a "deployer" role in AWS using OpenID Connect.
On first time, run a deploy from the local environment to create the bootstrap stack in your AWS account:

- Edit the `github` object in `sst.config.ts` to match your organization/repo.
- Set the environment variables as described in the "Remote Development" section.
- Run `npm run deploy:prod` to deploy from your local environment.

In the GitHub repository settings:

- Set the following secrets:
  - AWS_ACCOUNT_ID: your AWS account ID
  - COINCAP_API_KEY: your CoinCap API key (same as above)
- Turn on GHA

If the deploy hasn't started manually, trigger it manually or push a commit to the main branch.  
The following will happen in the pipeline:

- Run the E2E tests using Playwright.
- Deploy the SST stack.

Note:

- To inspect the report from a Playwright test run in GHA:
  - Download the `playwright-report` artifacts from the GHA run.
  - Unzip the file.
  - Run `npx playwright show-report ~/Download/playwright-report/` (or the path where you unzipped the report).

## How does the app work?

- The user navigates to the home page.
- Cloudfront invokes the Lambda which will run the Next.js server.
- Middleware checks if the user has a cookie. If not, it creates a new id cookie on the user browser
- The Next.js server renders the home page - most of the app is based on Server Components.
- Every updated rate, client-side we trigger a soft refresh, which results in updating all the Server Components, including those with the game state, score and BTC price.
- The user makes a guess: this is a Client Component triggering a Server Action.
- The guess is stored in DynamoDB together with the timestamp.
- The user can see how long till the guess resolves.
- After a minute, server-side logic will resolve the guess, overwriting the DDB guess item with a different payload, and the score item with the current one.
- This new payload will drive UI updates to show success/failure, update the score and allow for another go.

## ADR

I have documented my initial approach and the decisions I made in the ADR. You can find it in [ADR.md](docs/ADR.md).
