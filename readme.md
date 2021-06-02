Pancake Frontrunner

### Install

```
yarn install   //if using yarn
npm install    //if using npm
```

### Instructions

1. Create **.secret** file and paste seed phrase, see _.secret_template_ for demo
1. Fill up **config.js** settings - _bsc_token_address_ and _buy_amount_bnb_
1. Type `yarn i <bnb amount>` to insert BNB to WBNB contract
1. Type `yarn a <bnb amount>` to approve amount on WBNB contract
1. Type `yarn s` to check both amounts, make sure they are higher than _buy_amount_bnb_
1. (Optional) Adjust gasPrice and gasLimit in _config.js_
1. Type `yarn snipe` to start listener, process is auto exit after transaction succeeds/fails

### Commands

```
yarn p <token address>   //get pair address of token with bnb
yarn r <token address>   //get token's reserves info
yarn g                   //get current gas price of network
yarn s                   //get status of amount in and approved with WBNB contract
yarn i <bnb amount>      //insert bnb amount to WBNB contract
yarn a <bnb amount>      //approve bnb amount to be spent by WBNB contract
yarn o <bnb amount>      //withdraw bnb from WBNB contract

yarn buy                 //buy token immediately
yarn snipe               //start sniper (to listen and buy token when launched)
```

### Why might transaction fail?

- Not enough WBNB in and approved with WBNB contract
- Not enough gas (Set higher gasLimit)
