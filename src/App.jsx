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

const connectAccount = async (setWallet) => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    .catch((err) => {
      if (err.code === 4001) {
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    });

  const account = accounts[0];
  setWallet(account);
}

function App() {
  const [wallet, setWallet] = useState(null)

  useEffect(() => {
    validateProvider(setWallet);
  }, []);

  return (
    <div className="App">
      <div className="card">
        <Button 
          label="Connect Metamask wallet"
          primary={true}
          size="large"
          onClick={() => connectAccount(setWallet)}
          backgroundColor="#ff6c01"
          />
        <p>
          Wallet connection state: <code>{wallet}</code>
        </p>
      </div>
    </div>
  )
}

export default App
