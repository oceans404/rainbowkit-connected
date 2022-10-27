import { useState, useEffect } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import Web3 from "web3";
import {
  getDefaultWallets,
  RainbowKitProvider,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import "./App.css";

const { chains, provider } = configureChains(
  [chain.polygonMumbai, chain.polygon],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  const [activeAccount, setActiveAccount] = useState(null);

  useEffect(() => {
    checkAccounts();
    window.addEventListener("load", function () {
      if (window.ethereum) {
        App.web3 = new Web3(window.ethereum);

        // listen for account changes
        window.ethereum.on("accountsChanged", function (accounts) {
          console.log("accountsChanges", accounts);
          setActiveAccount(accounts[0] || null);
        });
      } else {
        console.log("no web3 detected...");
      }
    });
  }, []);

  const checkAccounts = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    setActiveAccount(accounts && accounts[0]);
  };

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div className="App">
          <header className="App-header">
            <ConnectButton />
            {activeAccount
              ? `Connected: ${activeAccount}`
              : "No accounts connected"}
          </header>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
