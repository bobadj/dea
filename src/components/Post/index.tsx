import React, {createContext, useContext, useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faEllipsisV, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { DropDown } from '../DropDown';
import { siteLookup } from '../../utils'
import Card from '../Card';
import Avatar from '../Avatar';
import './index.css';

const ContextInitialValues = {
    post: {
        id: 0,
        owner: '',
        content: '',
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
    const { post } = usePostContext();
    const [ caption, setCaption ] = useState<Caption>({ url: undefined, image: null });

    // useEffect(() => {
    //     const contentHasUri = () => (post.content || '').match(/(https?:\/\/[^ ]*)/g);
    //     const getUriFromContent = () => {
    //         const uris = (post.content || '').match(/(https?:\/\/[^ ]*)/g);
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
                <p>{post.content}</p>
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
    const [ dropdownVisible, setDropdownVisible ] = useState<boolean>(false);
    const { post } = usePostContext();

    const formatTime = () => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const date = new Date(post.timestamp) as any;
        const seconds = Math.floor((new Date() as any - date) / 1000);

        if (seconds > 86400) return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
        if (seconds > 3600) return Math.floor(seconds/3600) + "h";
        if (seconds > 60) return Math.floor(seconds/60) + "m";
        return Math.floor(seconds) + "s";
    }

    return (
        <div className="postHeader">
            <div className="avatarContainer">
                <Avatar />
                <div>
                    <a href={post.owner}><b>{post.owner}</b></a>
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
        timestamp: number,
        content: string
    }
}

export default function Post(props: PostProps) {

    return (
        <PostContext.Provider value={props}>
            <Card>
                <PostHeader />
                <PostContent />
                <PostActions />
            </Card>
        </PostContext.Provider>
    )
}
