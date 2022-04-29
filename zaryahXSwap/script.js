Moralis.initialize("FNXT2QIYDKpUpsWf4tPGe43GpPFr2QtEGAZxyQrF");
Moralis.serverURL = "https://3ko31fibhm5w.usemoralis.com:2053/server";

let dex;

const NATIVE_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
const ONEINCH_ADDRESS = "0x111111111117dc0aa78b770fa6a738034120c302";

(async function () {
  await Moralis.initPlugins();
  dex = Moralis.Plugins.oneInch;

  await Moralis.enableWeb3();
})();

async function swap() {
  const options = {
    chain: "bsc",
    fromTokenAddress: NATIVE_ADDRESS,
    toTokenAddress: ONEINCH_ADDRESS,
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
    document.getElementById("oneinchRes").value = 0;
  } else {
    amt = parseInt(amt);

    if (amt != 0) {
      const quote = await Moralis.Plugins.oneInch.quote({
        chain: "bsc", // The blockchain you want to use (eth/bsc/polygon)
        fromTokenAddress: NATIVE_ADDRESS, // The token you want to swap
        toTokenAddress: ONEINCH_ADDRESS, // The token you want to receive
        amount: amt,
      });
      document.getElementById("oneinchRes").value =
        quote.toTokenAmount / 10 ** quote.toToken.decimals;
    } else {
      document.getElementById("oneinchRes").value = 0;
    }
  }
}
