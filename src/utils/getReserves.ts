import { ethers } from "ethers";
import config from "../../config";
import { provider } from "../Instances/Instances";
import { getPairAddress } from "./getPairAddress";

const pairAbi = config.mainnet_abis.PAIR;
const WBNB_ADDRESS = config.mainnet_addresses.WBNB;

export const getReserves = async (pairAddress: string) => {
  const pairInstance = new ethers.Contract(pairAddress, pairAbi, provider);
  const [reserve, token0, token1] = await Promise.all([
    pairInstance.getReserves(),
    pairInstance.token0(),
    pairInstance.token1(),
  ]);

  let tokenReserve, wbnbReserve, reserve0, reserve1;
  if (token0 === WBNB_ADDRESS) {
    wbnbReserve = ethers.utils.formatEther(reserve[0]);
    tokenReserve = reserve[1].toString();
    reserve0 = "wbnbReserve";
    reserve1 = "tokenReserve";
  } else if (token1 === WBNB_ADDRESS) {
    wbnbReserve = ethers.utils.formatEther(reserve[1]);
    tokenReserve = reserve[0].toString();
    reserve1 = "wbnbReserve";
    reserve0 = "tokenReserve";
  }

  return {
    tokenReserve,
    wbnbReserve,
    reserve0,
    reserve1,
    blockTimestamp: new Date(reserve[2] * 1000).toLocaleString(),
  };
};

const main = async () => {
  const args = process.argv.slice(2);
  if (args.length > 1) {
    return console.log("Too many arguments");
  }
  const tokenAddress = args[0];

  const pairAddress = await getPairAddress(tokenAddress);
  const reserves = await getReserves(pairAddress);
  console.log(reserves);
};

if (require.main === module) {
  main();
}
