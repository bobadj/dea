import React, { useEffect, useState } from 'react';
import './index.css';

interface LoadingProps {
    visible: boolean,
    theme?: "dots"|"post"|undefined
}

export default function Loading(props: LoadingProps) {
    const [ isVisible, setIsVisible ] = useState<boolean>(props.visible);

    useEffect(() => {
        setIsVisible(props.visible);
    }, [props.visible]);
    if (!isVisible) return null;

    if (props.theme && props.theme === 'post') {
        return (
            <div className="postLoadingWrapper">
                <div className="image" />
                <div className="text">
                    <div className="textLine" />
                    <br/>
                    <div className="textLine" />
                    <div className="textLine" />
                </div>
            </div>
        )
    }

    return (
        <div className="loadingContainer">
            <div className="dotLoading" />
        </div>
    )
}
