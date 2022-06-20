import React from 'react';
import './index.css';

interface ButtonProps {
    theme?: 'default'|'outline'|'rounded',
    className?: 'primary'|'secondary',
    disabled?: boolean,
    loading?: boolean,
    onClick: Function,
    children: string|JSX.Element|JSX.Element[]
}

export default function Button(props: ButtonProps) {
    let classNames = [(props.className || 'default'), (props.theme || 'primary')];
    if (props.disabled) classNames.push('disabled');

    return (
        <button className={classNames.join(' ')} onClick={(e) => props.onClick(e)}>
            {props.children}
        </button>
    )
}