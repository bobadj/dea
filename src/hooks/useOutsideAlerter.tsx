import { useEffect } from 'react';

export default function useOutsideAlerter(ref: any, callback: Function) {
    useEffect(() => {
        const onMouseClickHandler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target)) {
                callback();
                return;
            }
        }

        document.addEventListener('mousedown', onMouseClickHandler);
        return () => {
            document.removeEventListener('mousedown', onMouseClickHandler);
        };
    }, [callback, ref])
}
