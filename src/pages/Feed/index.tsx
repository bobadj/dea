import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatFixed } from '@ethersproject/bignumber';
import useContract from "../../hooks/useContract";
import UserData from '../../components/UserData';
import UserTransactions from '../../components/UserTransactions';
import Loading from '../../components/Loading';
import Card from '../../components/Card';
import Post from '../../components/Post';
import ABI from '../../abis/Vibe.abi.json';
import './index.css';

const PostMockup = [
    {
        id: 1,
        owner: 'bobadj.eth',
        timestamp: 1638274995761,
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam luctus hendrerit metus, ut ullamcorper quam finibus at. Etiam id magna sit amet...'
    },
    {
        id: 2,
        owner: '0x0b8768A1863C0A78a14ad75445f56393beaF5a2d',
        timestamp: 1638274995761,
        content: 'Lorem ipsum dolor sit amet, https://ethereum.org consectetur adipiscing elit. Aliquam luctus hendrerit metus, ut ullamcorper quam finibus at. Etiam id magna sit amet...'
    },
]

const loadPosts = (num: number = 10) => {
    return new Promise((resolve, rejects) => {
        setTimeout(() => {
            resolve(Array(num).fill('').map((_, i) => {
                return PostMockup[i % 2];
            }));
        }, 2000);
    });
}

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
            const from = cleanup ? 0 : +latestPostId - 1;
            if (+latestPostId > currentPostLength-1) {
                setIsLoading(true);
                try {
                    const posts = await contract.fetchPostsRanged(from, 10);
                    setPosts((prevState => {
                        return cleanup ? posts : [...prevState, ...posts]
                    }));
                } catch (e) {
                    console.error(e)
                }
                setTimeout(() => {
                    setIsLoading(false);
                }, 1500);
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
