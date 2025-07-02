import { useEffect, useRef } from 'react';

export function useUnmountCleanup() {
    const timerRefs = useRef<Array<ReturnType<typeof setTimeout>>>([]);
    const abortRequestRefs = useRef<Array<AbortController>>([]);

    function timeoutUnmountHandler(timeout: ReturnType<typeof setTimeout>) {
        timerRefs.current.push(timeout);
    }

    function requestUnmountHandler(controller: AbortController) {
        abortRequestRefs.current.push(controller);
    }

    useEffect(() => {
        // Når komponenten unmountes bør vi cleare alle timeouts og requests
        return () => {
            for (const id of timerRefs.current) {
                clearTimeout(id);
            }

            for (const controller of abortRequestRefs.current) {
                controller.abort();
            }
        };
    }, []);

    return { timeoutUnmountHandler, requestUnmountHandler };
}
