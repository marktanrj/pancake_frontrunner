import fs from "fs";
import { ethers } from "ethers";
import config from "../../config";

export const provider = new ethers.providers.JsonRpcProvider(config.providers.mainnet);

const walletIndex = config.main.walletIndex;
const mnemonic = fs.readFileSync(config.main.mnemonic_filename).toString().trim();
const HDnode = ethers.utils.HDNode.fromMnemonic(mnemonic);
const thisWallet = HDnode.derivePath(`m/44'/60'/0'/0/${walletIndex}`);
export const wallet = new ethers.Wallet(thisWallet.privateKey, provider);
