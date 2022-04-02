import React, {useEffect, useState} from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatAddress, injected, walletconnect } from '../../utils';
import Avatar from '../Avatar'
import MetaMaskIcon from './meta-mask-icon.svg';
import WalletConnectIcon from './wallet-connect-icon.svg';
import './index.css';

export default function UserData() {
    const { account, library, activate } = useWeb3React<Web3Provider>();
    const [ ens, setEns ] = useState<string|null|undefined>(null)

    useEffect(() => {
        const getEns = async () => {
            if (!!library && !!account) {
                try {
                    const ens = await library.lookupAddress(account as string);
                    setEns(ens);
                } catch (e) {
                    console.error(e)
                }
            }
        };

        getEns();
    }, [account, library])

    const getUserSeed = () => {
        // @ts-ignore
        return account ?? navigator.buildID;
    };

    return (
        <div className="userData">
            <div className="userProfile">
                <div className="usrAvatar">
                    <Avatar seed={getUserSeed()} />
                </div>
                <div className="username">
                    <h3>{ens ?? formatAddress(account)}</h3>
                </div>
            </div>
            {
                account
                    ?
                    <ul className="userStatus">
                        <li>
                            <h4>Balance</h4>
                            <span>3,1k</span>
                        </li>
                        <li>
                            <h4>Total sponsors</h4>
                            <span>155</span>
                        </li>
                    </ul>
                    :
                    <ul className="userStatus">
                        <li>
                            <h4>Connect a wallet</h4>
                            <button className="loginButton" onClick={() => activate(injected)}>
                                <img src={MetaMaskIcon} alt="MetaMask" />
                                MetaMask
                            </button>
                            <button className="loginButton" onClick={() => activate(walletconnect)}>
                                <img src={WalletConnectIcon} alt="WalletConnect" />
                                WalletConnect
                            </button>
                        </li>
                    </ul>
            }
        </div>
    );
};
