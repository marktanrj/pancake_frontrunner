const fs = require("fs");
module.exports = {
    main: {
        mnemonic_filename: ".secret",
        bsc_token_address: "",
        walletIndex: "0",
        buy_amount_bnb: "0.001",
        slippagePercentage: "10",
        gasPrice: "",
        gasLimit: "180000"
    },
    providers: {
        mainnet: "https://bsc-dataseed1.binance.org"
    },
    mainnet_addresses: {
        PANCAKE_V1_ROUTER: "0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F",
        PANCAKE_V2_ROUTER: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
        PANCAKE_V2_FACTORY: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
        WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    },
    mainnet_abis: {
        PANCAKE_V2_ROUTER: JSON.parse(fs.readFileSync("contractsAbis/pancakeV2.json", "utf-8")),
        PANCAKE_V2_FACTORY: JSON.parse(fs.readFileSync("contractsAbis/pancakeV2Factory.json", "utf-8")),
        WBNB: JSON.parse(fs.readFileSync("contractsAbis/wbnb.json", "utf-8")),
        BEP20: [
            "function balanceOf(address account) external view returns (uint256)"
        ]
    },
};
