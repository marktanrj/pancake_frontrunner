import { BigNumber } from "@ethersproject/bignumber";
import { provider } from "../Instances/Instances";

export const getCurrentGasPrice = async (): Promise<BigNumber> => {
  const gasPrice = await provider.getGasPrice();
  return gasPrice;
};

const main = async () => {
  const gasPrice = await getCurrentGasPrice();
  console.log(`Current gas price: ${gasPrice}`);
};

if (require.main === module) {
  main();
}
