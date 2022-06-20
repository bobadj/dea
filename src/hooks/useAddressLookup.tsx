import { useEffect, useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";

export default function useAddressLookup(address: string|null|undefined) {
    const { library } = useWeb3React<Web3Provider>();
    const [ ens, setEns ] = useState<string|undefined|null>();
    const [ balance, setBalance ] = useState<number|string>(0)

    useEffect(() => {
        const getEns = async () => {
            if (!!library && !!address) {
                try {
                    const ens = await library.lookupAddress(address);
                    setEns(ens);
                } catch (e) {
                    console.error(e)
                }
            }
        }

        const getBalance = async () => {
            if (!!library && !!address) {
                try {
                    const balance = await library.getBalance(address);
                    setBalance(formatEther(balance));
                } catch (e) {
                    console.error(e)
                }
            }
        }

        getEns();
        getBalance();
    }, [address, ens, library])

    return {
        address,
        ens,
        balance
    }
}
