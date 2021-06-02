import { buyToken } from "../snipebot";

const main = async () => {
  await buyToken();
};

if (require.main === module) {
  main();
}
