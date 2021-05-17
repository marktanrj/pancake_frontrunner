const { ethers, Wallet, BigNumber } = require("ethers");

const fs = require("fs");
const mnemonic = fs.readFileSync(".secret").toString().trim();

const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed1.binance.org");
const PANCAKE_V1_ADDRESS = "0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F";
const PANCAKE_V2_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

const pancakeV2Abi = JSON.parse(fs.readFileSync("contractsAbis/live_pancakev2.json"));
const wbnbAbi = JSON.parse(fs.readFileSync("contractsAbis/live_wbnb.json"));
const dchAbi = JSON.parse(fs.readFileSync("contractsAbis/live_dch.json"));

const BEP20Abi = [
  "function balanceOf(address account) external view returns (uint256)"
];

const TOKEN_ADDRESS = "0x36dbcbca106353d49e1e0e8974492ffb862a0c92";

const main = async () => {
  const blockNumber = await provider.getBlockNumber();
  console.log(blockNumber);

  // const balance = await provider.getBalance("0x26ecDE95fb0107081Ef83BA34980Ca709b88067e");
  // const balanceReadable = ethers.utils.formatEther(balance);
  // console.log(balanceReadable);

  // const wei = ethers.utils.parseEther("1.0");
  // console.log(wei);

  // const signer = provider.getSigner();
  // const tx = signer.sendTransaction({
  //   to: "0x9ba6b1Ae6Cec6cE2eE4B0404239edFcE4480a420",
  //   value: ethers.utils.parseEther("1.0"),
  // });
  // console.log(tx);

  //--------------------

  const addressIndex = 0;
  const HDnode = ethers.utils.HDNode.fromMnemonic(mnemonic);
  const thisWallet = HDnode.derivePath(`m/44'/60'/0'/0/${addressIndex}`);
  const wallet = new ethers.Wallet(thisWallet.privateKey, provider);

  // const wallet = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${addressIndex}`);
  const walletAddress = wallet.address;

  const router = new ethers.Contract(PANCAKE_V2_ADDRESS, pancakeV2Abi, provider);
  const wbnb = new ethers.Contract(WBNB_ADDRESS, wbnbAbi, provider);
  const token = new ethers.Contract(TOKEN_ADDRESS, BEP20Abi, provider);

  //--------------------

  const amountIn = ethers.utils.parseEther("0.0001");
  const amountsOut = await router.getAmountsOut(amountIn, [WBNB_ADDRESS, TOKEN_ADDRESS]);
  console.log(amountsOut.toString())
  const amountOutMin = amountsOut[1].mul(BigNumber.from(90)).div(BigNumber.from(100));
  console.log(amountOutMin.toString())

  const wbnbConnected = wbnb.connect(wallet);
  await wbnbConnected.deposit({ value: amountIn });
  await wbnbConnected.approve(router.address, amountIn);

  const balance = await token.balanceOf(walletAddress);
  console.log(balance.toString());

  const gasPrice = await provider.getGasPrice();
  const routerConnected = router.connect(wallet);

  const deadlineInMinutes = 10;
  await routerConnected.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    [WBNB_ADDRESS, TOKEN_ADDRESS],
    walletAddress,
    Math.floor(Date.now() / 1000) + 60 * deadlineInMinutes,
    {
      gasPrice: gasPrice,
      gasLimit: 180000,
    }
  );


};

main();
