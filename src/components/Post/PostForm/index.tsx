import React, {useState} from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import Card from '../../Card';
import Avatar from '../../Avatar';
import './index.css'

interface PostFormProps {
    onSubmit: Function
}

export default function PostForm(props: PostFormProps) {
    const { account } = useWeb3React<Web3Provider>();
    const [ postContent, setPostContent ] = useState<string|undefined|null>(undefined);

    return (
        <Card>
            <div className="postForm">
                <div className="postHeader">
                    <div className="avatarContainer">
                        <Avatar seed={account as string} />
                    </div>
                </div>
                <div className="inputArea">
                    <textarea onChange={(e) => setPostContent(e.target.value)} placeholder="What is going on?" />
                </div>
                <div className="postActions">
                    <div className="postActionContent">
                        <button onClick={() => props.onSubmit(postContent)} className={!postContent ? 'disabled' : ''}>Post</button>
                    </div>
                </div>
            </div>
        </Card>
    )
}