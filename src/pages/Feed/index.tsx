import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatFixed } from '@ethersproject/bignumber';
import useContract from "../../hooks/useContract";
import UserData from '../../components/UserData';
import UserTransactions from '../../components/UserTransactions';
import Loading from '../../components/Loading';
import Card from '../../components/Card';
import { Post } from '../../components/Post';
import ABI from '../../abis/Vibe.abi.json';
import './index.css';

export default function Feed() {
    const { chainId } = useWeb3React<Web3Provider>();
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ posts, setPosts ] = useState<[]>([]);

    const contract = useContract(ABI, chainId);

    const fetchLastPostId = async () => {
        if (!!contract) {
            const latestPostId = await contract.getLatestPostID();
            return formatFixed(latestPostId);
        }
        return 0;
    }

    const fetchPosts = async (cleanup: boolean = true) => {
        if (!!contract) {
            let latestPostId = await fetchLastPostId();
            const currentPostLength = cleanup ? 0 : posts.length;
            const from = cleanup ? 0 : currentPostLength;
            if (+latestPostId > currentPostLength-1) {
                setIsLoading(true);
                try {
                    const posts = await contract.fetchPostsRanged(from, 5);
                    setPosts((prevState => {
                        return cleanup ? posts : [...prevState, ...posts]
                    }));
                } catch (e) {
                    console.error(e)
                }
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        fetchPosts();
    }, [chainId]);

    window.onscroll = async (e) => {
        if (!isLoading && (window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
            fetchPosts(false)
        }
    }

    return (
        <div className="feedPage">
            <div className="leftPanel">
                <Card>
                    <UserData />
                </Card>
            </div>
            <div className="postsPanel">
                <div className="posts">
                    {
                        posts
                            .map((post, i) => {
                                return <Post key={i} post={post} />
                            })
                    }
                    <Loading visible={isLoading} />
                </div>
            </div>
            <div className="rightPanel">
                <Card>
                    <UserTransactions />
                </Card>
            </div>
        </div>
    )
}
