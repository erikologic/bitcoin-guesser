- clone
- run codespace _should fail_
- set codespace env vars:
* AWS creds & region
* CoinCap secret
- update github org/repo in SST config
- deploy SST (to create the bootstrap stack)
- activate GHA
- set GHA secrets & vars:
* AWS_ACCOUNT_ID
* CoinCap secret
