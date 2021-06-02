import { ethers } from "ethers";
import config from "../../config";
import { provider, wallet as walletInstance } from "../Instances/Instances";

const WBNB_ADDRESS = config.mainnet_addresses.WBNB;
const wbnbAbi = config.mainnet_abis.WBNB;

const wbnbInstance = new ethers.Contract(WBNB_ADDRESS, wbnbAbi, provider);

export const setAmountInWbnb = async (bnbToInsert: string) => {
  const wbnbConnected = wbnbInstance.connect(walletInstance);
  const amountIn = ethers.utils.parseEther(bnbToInsert);
  const amountInDeposit = amountIn;
  const txOutput = await wbnbConnected.deposit({ value: amountInDeposit });
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
  const bnbToInsert = args[0];
  const txOutput = await setAmountInWbnb(bnbToInsert);
  console.log(txOutput);
};

if (require.main === module) {
  main();
}
