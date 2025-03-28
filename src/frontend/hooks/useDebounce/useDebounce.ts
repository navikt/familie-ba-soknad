import { useCallback, useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: unknown[]) => void>(
    funksjon: T,
    forsinkelse: number
) {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const debounced = useCallback(
        (...args: Parameters<T>) => {
            if (timer.current) {
                clearTimeout(timer.current);
            }

            timer.current = setTimeout(() => {
                funksjon(...args);
            }, forsinkelse);
        },
        [funksjon, forsinkelse]
    );

    useEffect(() => {
        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, []);

    return debounced;
}
