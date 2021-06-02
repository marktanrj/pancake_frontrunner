import { ethers } from "ethers";
import config from "../../config";
import { provider, wallet as walletInstance } from "../Instances/Instances";

const WBNB_ADDRESS = config.mainnet_addresses.WBNB;
const wbnbAbi = config.mainnet_abis.WBNB;
const walletAddress = walletInstance.address;
const PANCAKE_V2_ROUTER_ADDRESS = config.mainnet_addresses.PANCAKE_V2_ROUTER;
const pancakeV2RouterAbi = config.mainnet_abis.PANCAKE_V2_ROUTER;

const wbnbInstance = new ethers.Contract(WBNB_ADDRESS, wbnbAbi, provider);
const routerInstance = new ethers.Contract(PANCAKE_V2_ROUTER_ADDRESS, pancakeV2RouterAbi, provider);

export const printAmountInAndApproved = async (): Promise<void> => {
  const balanceBNB = await wbnbInstance.balanceOf(walletAddress);
  console.log({ amountIn: ethers.utils.formatEther(balanceBNB) });
  const allowanceBNB = await wbnbInstance.allowance(walletAddress, routerInstance.address);
  console.log({ approved: ethers.utils.formatEther(allowanceBNB) });
};

const main = async () => {
  await printAmountInAndApproved();
};

if (require.main === module) {
  main();
}
