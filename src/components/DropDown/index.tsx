import React, {useEffect, useState, useRef, createContext, useContext, MouseEventHandler} from 'react';
import useOutsideAlerter from '../../hooks/useOutsideAlerter';
import './index.css';

const ContextInitialValues = {
    visible: false
}

const DropDownContext = createContext(ContextInitialValues);
function useDropDownContext() {
    const context = useContext(DropDownContext)
    if (!context) {
        throw new Error(
            `DropDown compound components cannot be rendered outside the DropDown component`,
        );
    }
    return context
}

interface OptionProps {
    onClick: MouseEventHandler<HTMLElement>,
    children: JSX.Element|string
}

function Option(props: OptionProps) {
    useDropDownContext();
    return (
        <li onClick={props.onClick}>{props.children}</li>
    );
}

interface DropDownProps {
    visible: boolean,
    onClose: Function,
    children: JSX.Element|JSX.Element[]
}

function DropDown(props: DropDownProps) {
    const [ visible, setVisible ] = useState<boolean>(props.visible);

    useEffect(() => {
        setVisible(props.visible);
    }, [props.visible]);

    const ref = useRef(null);
    useOutsideAlerter(ref, () => {
        if (visible) {
            setVisible(false);
            // props.onClose();
        }
    });

    return (
        <DropDownContext.Provider value={props}>
            <div className="dropdownContainer" ref={ref}>
                <div className={`dropdown ${visible ? 'visible' : ''}`}>
                    <ul>
                        {props.children}
                    </ul>
                </div>
            </div>
        </DropDownContext.Provider>
    );
}

DropDown.Option = Option;
export {
    DropDown
}