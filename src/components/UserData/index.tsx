import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatAddress, injected, walletconnect } from '../../utils';
import Avatar from '../Avatar'
import Button from '../Button';
import MetaMaskIcon from './meta-mask-icon.svg';
import WalletConnectIcon from './wallet-connect-icon.svg';
import './index.css';

interface UserDataProps {
    ens?: string|undefined|null,
    address?: string|undefined|null,
    balance?: number|string|undefined|null
}

export default function UserData(props: UserDataProps) {
    const { ens, address, balance } = props;
    const { account, activate } = useWeb3React<Web3Provider>();

    const getUserSeed = () => {
        // @ts-ignore
        return address ?? navigator.buildID;
    };

    return (
        <div className="userData">
            <div className="userProfile">
                <div className="usrAvatar">
                    <Avatar seed={getUserSeed()} />
                </div>
                <div className="username">
                    <h3>{ens ?? formatAddress(address)}</h3>
                </div>
            </div>
            {
                account
                    ?
                    <ul className="userStatus">
                        <li>
                            <h4>Balance</h4>
                            <span>{balance}</span>
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
                            <Button onClick={() => activate(injected)} theme="outline">
                                <>
                                    <img src={MetaMaskIcon} alt="MetaMask" />
                                    MetaMask
                                </>
                            </Button>
                            <Button onClick={() => activate(walletconnect)} theme="outline">
                                <>
                                    <img src={WalletConnectIcon} alt="WalletConnect" />
                                    WalletConnect
                                </>
                            </Button>
                        </li>
                    </ul>
            }
        </div>
    );
};
