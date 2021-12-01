import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { availableAddresses } from '../utils';
import { Contract } from '@ethersproject/contracts';

export default function useContract(ABI: any, chainId: number|undefined) {
    const { library } = useWeb3React<Web3Provider>();

    return useMemo(() => {
        if (!ABI || !library || !chainId) return null;
        const address: string|null|undefined = availableAddresses[chainId];
        if (!address) return null;
        try {
            return new Contract(address, ABI, library)
        } catch (e) {
            return null;
        }
    }, [ABI, chainId, library]);
}
