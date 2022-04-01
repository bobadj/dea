import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';

export default function PostActions() {
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
