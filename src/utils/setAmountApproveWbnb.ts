import { ethers } from "ethers";
import config from "../../config";
import { provider, wallet as walletInstance } from "../Instances/Instances";

const WBNB_ADDRESS = config.mainnet_addresses.WBNB;
const wbnbAbi = config.mainnet_abis.WBNB;
const PANCAKE_V2_ROUTER_ADDRESS = config.mainnet_addresses.PANCAKE_V2_ROUTER;
const pancakeV2RouterAbi = config.mainnet_abis.PANCAKE_V2_ROUTER;

const wbnbInstance = new ethers.Contract(WBNB_ADDRESS, wbnbAbi, provider);
const routerInstance = new ethers.Contract(PANCAKE_V2_ROUTER_ADDRESS, pancakeV2RouterAbi, provider);

export const setAmountApproveWbnb = async (bnbToApprove: string) => {
  const wbnbConnected = wbnbInstance.connect(walletInstance);
  const amountIn = ethers.utils.parseEther(bnbToApprove);
  const amountToApprove = amountIn;
  const txOutput = await wbnbConnected.approve(routerInstance.address, amountToApprove); //set once
  return txOutput;
};

const main = async () => {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    return console.log("Incorrect usage, enter an amount to approve (in BNB)");
  }
  if (args.length > 1) {
    return console.log("Incorrect usage, too many arguments");
  }
  const bnbToApprove = args[0];
  const txOutput = await setAmountApproveWbnb(bnbToApprove);
  console.log(txOutput);
};

if (require.main === module) {
  main();
}
