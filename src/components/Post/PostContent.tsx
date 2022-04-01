import React, { useState } from 'react';
import { usePostContext } from './index';

interface Caption {
    url: string|undefined,
    image: string|null
}

export default function PostContent() {
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
