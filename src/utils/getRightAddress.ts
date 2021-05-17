import config from "../../config";

const WBNB_ADDRESS = config.mainnet_addresses.WBNB;

type getRightAddressType = [token0Address: string, token1Address: string];

export const getRightAddress = ([token0Address, token1Address]: getRightAddressType): null | {
  tokenAddress: string;
  wbnbAddress: string;
} => {
  let tokenAddress, wbnbAddress;
  if (token0Address === WBNB_ADDRESS) {
    wbnbAddress = token0Address;
    tokenAddress = token1Address;
  } else if (token1Address == WBNB_ADDRESS) {
    wbnbAddress = token1Address;
    tokenAddress = token0Address;
  } else {
    return null;
  }

  return { tokenAddress, wbnbAddress };
};
