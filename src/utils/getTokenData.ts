import { ethers } from "ethers";
import config from "../../config";
import { provider } from "../Instances/Instances";

const tokenAbi = config.mainnet_abis.BEP20;

export const getTokenData = async (tokenAddress: string, pairAddress: string) => {
  const tokenInstance = new ethers.Contract(tokenAddress, tokenAbi, provider);

  const tokenData = {
    name: "",
    symbol: "",
    tokenAddress,
    pairAddress,
    decimals: "",
    totalSupply: "",
  };

  const [name, symbol, decimals, totalSupply] = await Promise.all([
    tokenInstance.name(),
    tokenInstance.symbol(),
    tokenInstance.decimals(),
    tokenInstance.totalSupply(),
  ]);
  tokenData.name = name;
  tokenData.symbol = symbol;
  tokenData.decimals = decimals;
  tokenData.totalSupply = totalSupply.toString();

  return tokenData;
};
