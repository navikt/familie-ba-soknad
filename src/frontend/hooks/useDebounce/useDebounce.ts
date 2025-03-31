import { useCallback, useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: unknown[]) => void>(
    funksjon: T,
    forsinkelseMs: number
) {
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastArgs = useRef<Parameters<T> | null>(null);

    const debouncedFunksjon = useCallback(
        (...args: Parameters<T>) => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }

            lastArgs.current = args;

            timeout.current = setTimeout(() => {
                funksjon(...args);
                timeout.current = null;
                lastArgs.current = null;
            }, forsinkelseMs);
        },
        [funksjon, forsinkelseMs]
    );

    const ferdiggjørDebouncedFunksjon = () => {
        if (timeout.current && lastArgs.current) {
            clearTimeout(timeout.current);
            funksjon(...lastArgs.current);
            timeout.current = null;
            lastArgs.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        };
    }, []);

    return { debouncedFunksjon, ferdiggjørDebouncedFunksjon };
}
