Pancake Frontrunner

### Install

```
yarn install   //if using yarn
npm install    //if using npm
```

### Usage

1. Create **.secret** file and paste seed phrase, see _.secret_template_ for demo
1. Fill up **config.js** settings

```
yarn p <token address>   //get pair address of token with bnb
yarn r <token address>   //get token's reserves info
yarn g                   //get current gas price of network
yarn i <bnb amount>      //insert bnb amount to WBNB contract
yarn a <bnb amount>      //approve bnb amount to be spent by WBNB contract
yarn s                   //get status of amount in and approved
yarn buy                 //buy token immediately
yarn dev                 //start sniper (to listen and buy token when launched)
```
