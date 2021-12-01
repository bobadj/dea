import React, {useEffect, useState} from 'react';
import './index.css';

interface LoadingProps {
    visible: boolean,
}

export default function Loading(props: LoadingProps) {
    const [ isVisible, setIsVisible ] = useState<boolean>(props.visible);

    useEffect(() => {
        setIsVisible(props.visible);
    }, [props.visible]);
    if (!isVisible) return null;
    return (
        <div className="loadingContainer">
            <div className="dotLoading" />
        </div>
    )
}
