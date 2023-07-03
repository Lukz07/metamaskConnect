import { useEffect, useState } from 'react'
import { Button } from './stories/Button';
import './App.css'

import detectEthereumProvider from '@metamask/detect-provider';

const provider = await detectEthereumProvider();

const startApp = (provider, setWallet) => {
  if (provider !== window.ethereum) {
    console.error('Do you have multiple wallets installed?');
    setWallet('Do you have multiple wallets installed?')
  }
}

const validateProvider = (setWallet) => {
  if (provider) {
    startApp(provider, setWallet);
  } else {
    console.log('Please install MetaMask!');
    setWallet('Please install MetaMask!');
  }
}

const connectAccount = async (setWalletConnection) => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    .catch((err) => {
      if (err.code === 4001) {
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    });

  const account = accounts[0];
  setWalletConnection("Connected")
  return account;
}

const getBalance = async (account, setWalletAddress) => {
  const balance = await window.ethereum.request({ method: 'eth_getBalance', params: [
    account, "latest"
  ]});

  setWalletAddress({
    address: account,
    balance: parseInt(balance) / Math.pow(10, 16)
  })
}

const connectWallet = async (setWalletConnection, setWalletAddress) => {
  connectAccount(setWalletConnection).then((account) => getBalance(account, setWalletAddress))
}

function App() {
  const [walletConnection, setWalletConnection] = useState("Disconnected");
  const [walletAddress, setWalletAddress] = useState("No wallet address");

  useEffect(() => {
    validateProvider(setWalletConnection);
  }, []);

  return (
    <div className="App">
      <div className="card">
        <Button 
          label="Connect Metamask wallet"
          primary={true}
          size="large"
          onClick={() => connectWallet(setWalletConnection, setWalletAddress)}
          backgroundColor="#ff6c01"
          />
        <p>
          Wallet connection state: <b><code>{walletConnection}</code></b>
        </p>
        <p>
          Wallet adress: <b><code>{walletAddress.address}</code></b><br/>
          Wallet balance: <b><code>{walletAddress.balance}</code></b>
        </p>
      </div>
    </div>
  )
}

export default App
