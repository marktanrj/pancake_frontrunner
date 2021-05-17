import { ethers } from "ethers";
import config from "../../config";
import { provider } from "../Instances/Instances";

const tokenAbi = config.mainnet_abis.BEP20;

export const getBalanceOf = async (tokenAddress: string, walletAddress: string) => {
  const tokenInstance = new ethers.Contract(tokenAddress, tokenAbi, provider);
  const balance = await tokenInstance.balanceOf(walletAddress);
  const balanceInString = balance.toString();
  return balanceInString;
};
