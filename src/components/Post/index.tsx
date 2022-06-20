import React, {createContext, useContext, useEffect, useState} from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatAddress, siteLookup } from '../../utils'
import Card from '../Card';
import Loading from '../Loading';
import PostActions from './PostActions';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostForm from './PostForm';
import './index.css';

const ContextInitialValues = {
    post: {
        id: 0,
        owner: '',
        ownerEns: '',
        text: '',
        timestamp: 0
    }
}

const PostContext = createContext(ContextInitialValues);
function usePostContext() {
    const context = useContext(PostContext)
    if (!context) {
        throw new Error(
            `Post compound components cannot be rendered outside the Post component`,
        );
    }
    return context
}

interface PostProps {
    post: {
        id: number,
        owner: string,
        ownerEns: string,
        timestamp: number,
        text: string
    },
    loading?: true
}

function Post(props: PostProps) {
    const { library } = useWeb3React<Web3Provider>();
    const [ post, setPost ] = useState<any>(props.post);
    const [ loading, setLoading ] = useState<boolean>(props.loading || true);

    useEffect(() => {
        const getEns = async () => {
            if (!!library) {
                try {
                    const ens = await library.lookupAddress(props.post.owner);
                    setPost((prevState: any) => {
                        return {...prevState, ownerEns: ens ?? formatAddress(props.post.owner)}
                    })
                } catch (e) {
                    console.error(e)
                }
                setLoading(false);
            }
        };

        getEns();
    })

    return (
        <PostContext.Provider value={{post}}>
            {
                loading
                    ?
                    <Card>
                        <Loading theme="post" visible={loading} />
                    </Card>
                    :
                    <Card>
                        <PostHeader />
                        <PostContent />
                        <PostActions />
                    </Card>
            }
        </PostContext.Provider>
    )
}

Post.Header = PostHeader;
Post.Content = PostContent;
Post.Actions = PostActions;
Post.Form = PostForm;
export {
    usePostContext,
    Post,
}
