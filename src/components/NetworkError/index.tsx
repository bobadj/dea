import React from 'react';
import { SUPPORTED_CHAINS } from '../../utils';
import Card from '../Card';
import Button from '../Button';
import './index.css';

export default function NetworkError() {

    const changeNetwork = async (chainId: any) => {
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
                {
                    Object.keys(SUPPORTED_CHAINS)
                        .map((chain: string) => {
                            // @ts-ignore
                            return <Button key={`network_change_${chain}`} onClick={() => changeNetwork(SUPPORTED_CHAINS[chain])} theme="outline">
                                <span>Change to {chain}</span>
                            </Button>
                        })
                }
            </div>
            <p className="help-text">
                You may need to switch network manually.
            </p>
        </Card>
    )
}
