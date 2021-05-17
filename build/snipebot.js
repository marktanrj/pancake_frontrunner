"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const ethers_1 = require("ethers");
const config_1 = __importDefault(require("../config"));
const provider = new ethers_1.ethers.providers.JsonRpcProvider(config_1.default.providers.mainnet);
const PANCAKE_V2_ROUTER_ADDRESS = config_1.default.mainnet_addresses.PANCAKE_V2_ROUTER;
const PANCAKE_V2_FACTORY_ADDRESS = config_1.default.mainnet_addresses.PANCAKE_V2_FACTORY;
const WBNB_ADDRESS = config_1.default.mainnet_addresses.WBNB;
const TOKEN_ADDRESS = config_1.default.main.bsc_token_address;
const pancakeV2Abi = config_1.default.mainnet_abis.PANCAKE_V2_ROUTER;
const pancakeV2FactoryAbi = config_1.default.mainnet_abis.PANCAKE_V2_FACTORY;
const wbnbAbi = config_1.default.mainnet_abis.WBNB;
const tokenAbi = config_1.default.mainnet_abis.BEP20;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const factory = new ethers_1.ethers.Contract(PANCAKE_V2_FACTORY_ADDRESS, pancakeV2FactoryAbi, provider);
    factory.on("PairCreated", (token0, token1, pair, uint) => {
        const number = uint.toString();
        console.log({ token0, token1, pair, number });
    });
    // const r = await factory.getPair(WBNB_ADDRESS, "0xCAE17cc3bA8BC46d69be01286fBfB285B1f72f3F")
    // console.log(r);
});
exports.main = main;
