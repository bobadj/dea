import React, { useEffect, useState } from 'react';
import * as blockies from 'blockies-ts';

interface AvatarProps {
    seed?: string
}

export default function Avatar(props: AvatarProps) {
    const [ avatar, setAvatar ] = useState<string|undefined>(undefined);

    useEffect(() => {
        setAvatar(blockies.create({
            seed: props.seed ?? '',
            size: 10,
            scale: 10
        }).toDataURL());
    }, [])

    return <img src={avatar} alt="user avatar" />;
}