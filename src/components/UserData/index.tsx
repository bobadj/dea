import React from 'react';
import Avatar from '../Avatar'
import './index.css';

export default function UserData() {
    const getUserSeed = () => {
        // @ts-ignore
        return navigator.buildID;
    };

    return (
        <div className="userData">
            <div className="userProfile">
                <div className="usrAvatar">
                    <Avatar seed={getUserSeed()} />
                </div>
                <div className="username">
                    <h3>...</h3>
                </div>
            </div>
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
        </div>
    );
};
