import { ethers } from "ethers";

import config from "../../config";
import { provider } from "../Instances/Instances";

const PANCAKE_V2_FACTORY_ADDRESS = config.mainnet_addresses.PANCAKE_V2_FACTORY;
const WBNB_ADDRESS = config.mainnet_addresses.WBNB;
const pancakeV2FactoryAbi = config.mainnet_abis.PANCAKE_V2_FACTORY;
const pairAbi = config.mainnet_abis.PAIR;

const factory = new ethers.Contract(PANCAKE_V2_FACTORY_ADDRESS, pancakeV2FactoryAbi, provider);
const deadAddress = "0x0000000000000000000000000000000000000000";

export const getPairAddress = async (addressToCheck: string): Promise<string> => {
  const result = await factory.getPair(addressToCheck, WBNB_ADDRESS);
  if (result === deadAddress) {
    return "No Pair";
  }
  return result;
};

const main = async () => {
  const args = process.argv.slice(2);
  if (args.length > 1) {
    return console.log("Too many arguments");
  }
  const address = args[0];
  const pairAddress = await getPairAddress(address);
  console.log(`Pair address: ${pairAddress}`);
};

if (require.main === module) {
  main();
}
