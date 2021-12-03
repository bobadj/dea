import React, {createContext, useContext, useEffect, useState} from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faEllipsisV, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { DropDown } from '../DropDown';
import { formatAddress, siteLookup } from '../../utils'
import Card from '../Card';
import Avatar from '../Avatar';
import './index.css';
import Loading from "../Loading";

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

function PostActions() {
    return (
        <div className="postActions">
            <div className="postActionContent">
                <div>
                    <FontAwesomeIcon icon={faCoins} />
                    <span>1.5k</span>
                </div>
                <div>
                    <FontAwesomeIcon icon={faHandHoldingUsd} />
                </div>
            </div>
        </div>
    )
}
interface Caption {
    url: string|undefined,
    image: string|null
}
function PostContent() {
    const { post: { text } } = usePostContext();
    const [ caption, setCaption ] = useState<Caption>({ url: undefined, image: null });

    // useEffect(() => {
    //     const contentHasUri = () => (text || '').match(/(https?:\/\/[^ ]*)/g);
    //     const getUriFromContent = () => {
    //         const uris = (text || '').match(/(https?:\/\/[^ ]*)/g);
    //         return uris ? uris[0] : '';
    //     }
    //     if (contentHasUri()) {
    //         const getCaptionFromUrl = async () => {
    //             try {
    //                 const { og } = await siteLookup(getUriFromContent());
    //                 if (!!og) {
    //                     setCaption({
    //                         image: og.image as string,
    //                         url: getUriFromContent()
    //                     });
    //                 }
    //             } catch (e) {
    //                 console.error(e)
    //             }
    //         }
    //         getCaptionFromUrl()
    //     }
    // }, [])

    return (
        <>
            <div className="postContent">
                <p>{text}</p>
            </div>
            {
                !!caption.image
                    ?
                    <div className="postCaption">
                        <a href={caption.url} target="_blank" rel="noreferrer">
                            <img src={caption.image} alt="post caption" />
                        </a>
                    </div>
                    :
                    null
            }
        </>
    );
}
function PostHeader() {
    const { post: { timestamp, owner, ownerEns } } = usePostContext();
    const [ dropdownVisible, setDropdownVisible ] = useState<boolean>(false);

    const formatTime = () => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const date = new Date((BigNumber.from(timestamp)).toNumber() * 1000) as any;
        const seconds = Math.floor((new Date() as any - date) / 1000);

        if (seconds > 86400) return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
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

export default function Post(props: PostProps) {
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
