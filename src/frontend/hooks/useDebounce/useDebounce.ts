import { useCallback, useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: unknown[]) => void>(
    funksjon: T,
    forsinkelseMs: number
) {
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const forsinketFunksjon = useCallback(
        (...args: Parameters<T>) => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }

            timeout.current = setTimeout(() => {
                funksjon(...args);
            }, forsinkelseMs);
        },
        [funksjon, forsinkelseMs]
    );

    useEffect(() => {
        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        };
    }, []);

    return forsinketFunksjon;
}
