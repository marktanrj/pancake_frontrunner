import { BigNumber, ethers } from "ethers";

import config from "../config";
import { getRightAddress } from "./utils/getRightAddress";
import { provider, wallet as walletInstance } from "./Instances/Instances";
import { getTokenData } from "./utils/getTokenData";
import { getReserves } from "./utils/getReserves";
import { getPairAddress } from "./utils/getPairAddress";
import { printAmountInAndApproved } from "./utils/printAmountInAndApproved";

const PANCAKE_V2_ROUTER_ADDRESS = config.mainnet_addresses.PANCAKE_V2_ROUTER;
const PANCAKE_V2_FACTORY_ADDRESS = config.mainnet_addresses.PANCAKE_V2_FACTORY;
const WBNB_ADDRESS = config.mainnet_addresses.WBNB;
const TOKEN_ADDRESS = config.main.bsc_token_address;

const pancakeV2RouterAbi = config.mainnet_abis.PANCAKE_V2_ROUTER;
const pancakeV2FactoryAbi = config.mainnet_abis.PANCAKE_V2_FACTORY;
// const wbnbAbi = config.mainnet_abis.WBNB;
// const tokenAbi = config.mainnet_abis.BEP20;
const pairAbi = config.mainnet_abis.PAIR;

const buy_bnb_amount = config.main.buy_amount_bnb;
// const slippage = config.main.slippagePercentage;
const customGasPrice = config.main.gasPrice;
const customGasLimit = config.main.gasLimit;
const enableBuyFunction = config.main.enableBuyFunction;

const factory = new ethers.Contract(PANCAKE_V2_FACTORY_ADDRESS, pancakeV2FactoryAbi, provider);
const routerInstance = new ethers.Contract(PANCAKE_V2_ROUTER_ADDRESS, pancakeV2RouterAbi, provider);
// const wbnbInstance = new ethers.Contract(WBNB_ADDRESS, wbnbAbi, provider);

let bought = false;
const amountIn = ethers.utils.parseEther(buy_bnb_amount);
const walletAddress = walletInstance.address;

export const buyToken = async (): Promise<void> => {
  try {
    // const [amountsOut, gasPrice] = await Promise.all([
    //   routerInstance.getAmountsOut(amountIn, [WBNB_ADDRESS, tokenAddress]),
    //   provider.getGasPrice(),
    // ]);
    // const amountOutMin = amountsOut[1].mul(BigNumber.from(100 - parseInt(slippage))).div(BigNumber.from(100));
    // console.log({ amountsOut: amountsOut.toString() });
    // console.log({ amountOutMin: amountOutMin.toString() });
    // console.log({ gasPrice: gasPrice.toString() });
    console.log("BUYING NOW");

    const deadlineInMinutes = 10;
    const gasPrice = customGasPrice === "" ? BigNumber.from("5000000000") : BigNumber.from(customGasPrice);
    const gasLimit = customGasLimit === "" ? BigNumber.from("200000") : BigNumber.from(customGasLimit);
    const customAmountOutMin = BigNumber.from("1");

    const routerConnected = routerInstance.connect(walletInstance);
    const tx = await routerConnected.swapExactTokensForTokens(
      amountIn,
      customAmountOutMin,
      [WBNB_ADDRESS, TOKEN_ADDRESS],
      walletAddress,
      Math.floor(Date.now() / 1000) + 60 * deadlineInMinutes,
      {
        gasPrice: gasPrice,
        gasLimit: gasLimit,
      },
    );
    console.log("Transaction sent");

    const receipt = await tx.wait();
    console.log("Transaction receipt");
    console.log(receipt);
  } catch (err) {
    console.log(err);
    console.log("Transaction failed");
  }
};

const buyOrder = async () => {
  if (!bought) {
    bought = true;
    if (enableBuyFunction) {
      await buyToken();
      console.log({ bought });
      process.exit();
    }
  }
  return;
};

const onPairSwap = async (sender, amount0In, amount1In, amount0Out, amount1Out, to) => {
  console.log({
    sender,
    amount0In: amount0In.toString(),
    amount1In: amount1In.toString(),
    amount0Out: amount0Out.toString(),
    amount1Out: amount1Out.toString(),
    to,
  });
  await buyOrder();
};

const onPairMint = async (sender, amount0, amount1) => {
  console.log({
    sender,
    amount0: amount0.toString(),
    amount1: amount1.toString(),
  });
  await buyOrder();
};

const createPairSwapOrMintListener = (pairAddress) => {
  const pairInstance = new ethers.Contract(pairAddress, pairAbi, provider);
  pairInstance.on("Swap", onPairSwap);
  pairInstance.on("Mint", onPairMint);
};

const onFactoryPairCreated = async (token0Address, token1Address, pairAddress, uint) => {
  console.log("Found new coin!");

  const rightAddresses = getRightAddress([token0Address, token1Address]);
  if (rightAddresses === null) {
    return;
  }
  const { tokenAddress, wbnbAddress } = rightAddresses;

  const [tokenData, reserves] = await Promise.all([getTokenData(tokenAddress, pairAddress), getReserves(pairAddress)]);
  const tokenAllData = { ...tokenData, ...reserves };
  console.log(tokenAllData.name);

  if (tokenAddress !== TOKEN_ADDRESS) {
    return;
  }

  console.log(tokenAllData);

  const hasReserves = tokenAllData.tokenReserve !== "0" && tokenAllData.wbnbReserve !== "0.0";
  if (hasReserves) {
    await buyOrder();
    return;
  } else {
    createPairSwapOrMintListener(pairAddress);
  }
};

export const main = async () => {
  await printAmountInAndApproved();

  const pairAddress = await getPairAddress(TOKEN_ADDRESS);
  if (pairAddress === "No Pair") {
    console.log("NO PAIR CREATED, WILL LISTEN TO FACTORY FOR PAIR CREATION");
    factory.on("PairCreated", onFactoryPairCreated);
  } else {
    console.log("PAIR FOUND, WILL LISTENING TO ACTIVITY");
    createPairSwapOrMintListener(pairAddress);
  }
};
