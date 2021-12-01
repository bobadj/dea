import React, { useEffect, useState } from 'react';
import UserData from '../../components/UserData';
import UserTransactions from '../../components/UserTransactions';
import Loading from '../../components/Loading';
import Card from '../../components/Card';
import Post from '../../components/Post';
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
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ posts, setPosts ] = useState<[]>([]);

    const fetchPosts = async (cleanup: boolean = true) => {
        setIsLoading(true);
        const posts = await loadPosts();
        setPosts(((prevState: []) => {
            return cleanup ? posts as [] : [...prevState, ...posts as []]
        }));
        setIsLoading(false);
    }

    useEffect(() => {
        fetchPosts();
    }, []);

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
