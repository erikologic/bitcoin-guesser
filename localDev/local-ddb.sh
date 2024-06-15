#! /bin/bash
set -m

docker run -p 8000:8000 amazon/dynamodb-local &

sleep 5
export AWS_ACCESS_KEY_ID=DUMMY
export AWS_SECRET_ACCESS_KEY=DUMMY
export AWS_DEFAULT_REGION=eu-west-1
export AWS_ENDPOINT_URL=http://localhost:8000

echo "Checking if table exists"
aws dynamodb list-tables --output=text | grep local-bitcoin-guesser-scoreboard

if [[ $? -ne 0 ]]; then
    echo "Creating table"
    aws dynamodb create-table \
        --table-name local-bitcoin-guesser-scoreboard \
        --key-schema AttributeName=pk,KeyType=HASH AttributeName=sk,KeyType=RANGE \
        --attribute-definitions AttributeName=pk,AttributeType=S AttributeName=sk,AttributeType=S \
        --billing-mode PAY_PER_REQUEST \
        --output=text
fi

fg