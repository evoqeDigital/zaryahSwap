Moralis.initialize("2NCSfAkNPfDIMZUaKvAdZnwvzx8toRost5LlbawZ");
Moralis.serverURL = "https://dq6kirqwge4c.usemoralis.com:2053/server";

let dex;

const NATIVE_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
const DNZ_ADDRESS = "0x259A2a5191C8b0D60D4Ea610Ae30c23d38101b24";

(async function () {
  await Moralis.enableWeb3();
  await Moralis.initPlugins();
  dex = Moralis.Plugins.oneInch;
})();

async function swap() {
  const options = {
    chain: "bsc",
    fromTokenAddress: NATIVE_ADDRESS,
    toTokenAddress: DNZ_ADDRESS,
    amount: Number(Moralis.Units.ETH("0.01")),
    fromAddress: Moralis.User.current().get("ethAddress"),
    slippage: 1,
  };

  var receipt = await dex.swap(options);
  console.log(receipt);
}

async function login() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate({
      siginingMessage: "Log on to Metamask",
    })
      .then(function (user) {
        console.log("Logged in as:", user);
        console.log(user.get("ethAddress"));
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

async function getQuote() {
  let amt = document.getElementById("wbnbAmt").value;
  if (amt.length == 0) {
    document.getElementById("dnzRes").value = 0;
  } else {
    amt = parseInt(amt);

    if (amt != 0) {
      const quote = await Moralis.Plugins.oneInch.quote({
        chain: "bsc", // The blockchain you want to use (eth/bsc/polygon)
        fromTokenAddress: NATIVE_ADDRESS, // The token you want to swap
        toTokenAddress: DNZ_ADDRESS, // The token you want to receive
        amount: amt,
      });
      document.getElementById("dnzRes").value =
        quote.toTokenAmount / 10 ** quote.toToken.decimals;
    } else {
      document.getElementById("dnzRes").value = 0;
    }
  }
}
