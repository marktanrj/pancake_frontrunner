import { ethers } from "ethers";
import config from "../../config";
import { provider, wallet as walletInstance } from "../Instances/Instances";

const WBNB_ADDRESS = config.mainnet_addresses.WBNB;
const wbnbAbi = config.mainnet_abis.WBNB;

const wbnbInstance = new ethers.Contract(WBNB_ADDRESS, wbnbAbi, provider);

export const withdrawAmountWbnb = async (bnbToWithdraw: string) => {
  const wbnbConnected = wbnbInstance.connect(walletInstance);
  const amountOut = ethers.utils.parseEther(bnbToWithdraw);
  const txOutput = await wbnbConnected.withdraw(amountOut);
  return txOutput;
};

const main = async () => {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    return console.log("Incorrect usage, enter an amount to insert (in BNB)");
  }
  if (args.length > 1) {
    return console.log("Incorrect usage, too many arguments");
  }
  const bnbToWithdraw = args[0];
  const txOutput = await withdrawAmountWbnb(bnbToWithdraw);
  console.log(txOutput);
};

if (require.main === module) {
  main();
}
