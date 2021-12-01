import React from 'react';
import './index.css';

interface CardProps {
    className?: string,
    children: JSX.Element|JSX.Element[]
}

export default function Card(props: CardProps) {
    return (
        <div className={`card ${props.className ?? ''}`}>
            <div className="cardContent">
                {props.children}
            </div>
        </div>
    );
}
