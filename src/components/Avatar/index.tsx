import React, { useEffect, useState } from 'react';
import * as blockies from 'blockies-ts';
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";

interface AvatarProps {
    seed?: string
}

export default function Avatar(props: AvatarProps) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [ avatar, setAvatar ] = useState<string|undefined>(undefined);

    useEffect(() => {
        const getAvatar = async () => {
            if (!!library && !!account) {
                try {
                    const avt = await library.getAvatar(props.seed as string);
                    if (avt) {
                        setAvatar(avt as string);
                    } else {
                        setAvatar(blockies.create({
                            seed: props.seed ?? '',
                            size: 10,
                            scale: 10
                        }).toDataURL());
                    }
                } catch (e) {
                    console.log(e);
                }
            } else {
                setAvatar(blockies.create({
                    seed: props.seed ?? '',
                    size: 10,
                    scale: 10
                }).toDataURL());
            }
        };

        getAvatar();
    }, [props.seed])

    return <img src={avatar} alt="user avatar" />;
}