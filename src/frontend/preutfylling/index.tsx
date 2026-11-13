import { lazy, Suspense } from 'react';

import { skalVisePreutfylling } from './skalVisePreutfylling';

const Preutfyllingspanel = lazy(() => import('./Preutfyllingspanel'));

/**
 * Testverktøy for å sende inn søknader uten å fylle dem ut for hånd. All koden ligger i denne mappen, og koden for
 * selve panelet lastes bare ned der panelet skal vises.
 */
export function Preutfylling() {
    if (!skalVisePreutfylling(window.location)) {
        return null;
    }
    return (
        <Suspense fallback={null}>
            <Preutfyllingspanel />
        </Suspense>
    );
}
