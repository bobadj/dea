import React, { useEffect } from 'react';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { injected, network } from './utils';
import { Web3Provider } from '@ethersproject/providers';
import Feed from './pages/Feed';
import './App.css';

function getLibrary(provider: any) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function Page() {
  const { activate, deactivate } = useWeb3React<Web3Provider>();

  useEffect(() => {
    const loadNetwork = async () => {
      const isWalletAuthorized = await injected.isAuthorized();
      if (!isWalletAuthorized) {
        await activate(network);
      } else {
        await activate(injected);
      }
    }

    loadNetwork();
    const { ethereum } = window as any;
    if (ethereum && ethereum.on) {
      const accountChangeHandler = (accounts: string[]) => {
        if (accounts.length < 1) deactivate()
      }
      ethereum.on('accountsChanged', accountChangeHandler);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', accountChangeHandler);
        }
      }
    }
  }, []);

  return <Feed />
}

export default function App() {
  return (
      <Web3ReactProvider getLibrary={getLibrary}>
        <Page />
      </Web3ReactProvider>
  );
}
