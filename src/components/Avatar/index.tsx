import React, { useEffect, useState } from 'react';
import * as blockies from 'blockies-ts';

interface AvatarProps {
    seed: string,
    size?: number,
    scale?: number
}

export default function Avatar(props: AvatarProps) {
    const [ avatar, setAvatar ] = useState<string|undefined>(undefined);

    useEffect(() => {
        setAvatar(blockies.create({
            seed: props.seed,
            size: props.size ?? 10,
            scale: props.scale ?? 10
        }).toDataURL());
    }, [props])

    return <img src={avatar} alt={`${props.seed} avatar`} />;
}