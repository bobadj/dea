import React from 'react';
import { SUPPORTED_CHAINS } from '../../utils';
import Card from '../Card';
import './index.css';

export default function NetworkError() {

    const changeNetwork = async (chainId: number) => {
        const { ethereum } = window as any;
        if (!!ethereum) {
            try {
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{chainId: '0x'+chainId}],
                });
            } catch (switchError) {
                console.log("Cannot switch to the network");
            }
        }
    }

    return (
        <Card className="unsupportedNetworkCard">
            <p>You are using unsupported network!</p>
            <div className="actions">
                <button onClick={() => changeNetwork(SUPPORTED_CHAINS.Ropsten)}>
                    Change to Ropsten
                </button>
                <button onClick={() => changeNetwork(SUPPORTED_CHAINS.Rinkeby)}>
                    Change to Rinkeby
                </button>
            </div>
            <p className="help-text">
                You may need to switch network manually.
            </p>
        </Card>
    )
}