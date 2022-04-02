import React, { useEffect, useState } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatFixed } from '@ethersproject/bignumber';
import useContract from "../../hooks/useContract";
import UserData from '../../components/UserData';
import UserTransactions from '../../components/UserTransactions';
import Loading from '../../components/Loading';
import Card from '../../components/Card';
import { Post, PostForm } from '../../components/Post';
import NetworkError from '../../components/NetworkError';
import ABI from '../../abis/Vibe.abi.json';
import './index.css';

export default function Feed() {
    const { chainId, library, account, error } = useWeb3React<Web3Provider>();
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ posts, setPosts ] = useState<[]>([]);
    const [ isUnsupportedChain, setIsUnsupportedChain ] = useState<boolean>(error instanceof UnsupportedChainIdError);

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
            let loadLimit = 4;
            let from = (+latestPostId - (cleanup ? 0 : posts.length)) - loadLimit;
            // toDo: load last few items
            if (posts.length < +latestPostId) {
                setIsLoading(true);
                try {
                    let fetchedPosts = await contract.fetchPostsRanged(from, loadLimit);
                    fetchedPosts = Array.from(fetchedPosts).reverse();
                    setPosts((prevState => {
                        return cleanup ? fetchedPosts : [...prevState, ...fetchedPosts]
                    }));
                } catch (e) {
                    console.error(e)
                }
                setIsLoading(false);
            }
        }
    }

    const submitPostForm = async (value: any) => {
        if (!!contract && !!library) {
            try {
                const signer = contract.connect(library.getSigner());
                const transaction = await signer.createPost(value);
                setIsLoading(true);
                await transaction.wait();
                await fetchPosts();
            } catch (e) {
                console.error(e);
            }
        }
    };

    useEffect(() => {
        if (!isUnsupportedChain) {
            fetchPosts();
        }
        setIsUnsupportedChain(error instanceof UnsupportedChainIdError);
    }, [chainId, error]);

    window.onscroll = async (e) => {
        if (!isLoading && (window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
            fetchPosts(false)
        }
    }

    if (isUnsupportedChain) {
        return (
            <div className="feedPage">
                <NetworkError />
            </div>
        )
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
                    { account ? <PostForm onSubmit={submitPostForm} /> : null }
                    {
                        posts
                            .filter((post: any) => {
                                return (post.owner || '') !== '0x0000000000000000000000000000000000000000';
                            })
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
