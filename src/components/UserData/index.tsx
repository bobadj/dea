import React, {useEffect, useState} from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import { formatAddress } from '../../utils';
import Avatar from '../Avatar'
import './index.css';

export default function UserData() {
    const { account, library } = useWeb3React<Web3Provider>();
    const [ gasPrice, setGasPrice ] = useState<string|undefined|number>(0);

    useEffect(() => {
        const getGasPrice = async () => {
            if (!!library) {
                const gasPrice = await library.getGasPrice();
                setGasPrice(formatEther(gasPrice) as any)
            }
        }

        getGasPrice();
    })

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
                    <h3>{formatAddress(account)}</h3>
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
                            <h4>Gas price</h4>
                            <span>{gasPrice}</span>
                        </li>
                    </ul>
            }
        </div>
    );
};
