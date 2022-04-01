import React, { useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Avatar from '../../Avatar';
import { DropDown } from '../../DropDown';
import { usePostContext } from '../index';

export default function PostHeader() {
    const { post: { timestamp, owner, ownerEns } } = usePostContext();
    const [ dropdownVisible, setDropdownVisible ] = useState<boolean>(false);

    const formatTime = () => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const date = new Date((BigNumber.from(timestamp)).toNumber() * 1000) as any;
        const seconds = Math.floor((new Date() as any - date) / 1000);

        if (seconds > 86400) return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`
        if (seconds > 3600) return Math.floor(seconds/3600) + "h";
        if (seconds > 60) return Math.floor(seconds/60) + "m";
        return Math.floor(seconds) + "s";
    }

    return (
        <div className="postHeader">
            <div className="avatarContainer">
                <Avatar seed={owner} />
                <div>
                    <a href={owner}><b>{ownerEns}</b></a>
                    <small>{formatTime()}</small>
                </div>
            </div>
            <div>
                <FontAwesomeIcon icon={faEllipsisV} onClick={() => setDropdownVisible(!dropdownVisible)} />
                <DropDown visible={dropdownVisible} onClose={() => setDropdownVisible(false)}>
                    <DropDown.Option onClick={() => console.log('Delete')}>Delete</DropDown.Option>
                    <DropDown.Option onClick={() => console.log('Open')}>Open</DropDown.Option>
                    <DropDown.Option onClick={() => console.log('Sponsor')}>Sponsor</DropDown.Option>
                </DropDown>
            </div>
        </div>
    )
}
