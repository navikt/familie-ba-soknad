import { lazy, Suspense } from 'react';

import { Feilgrense } from './Feilgrense';
import { skalVisePreutfylling } from './skalVisePreutfylling';

const Preutfyllingspanel = lazy(() => import('./Preutfyllingspanel'));

/**
 * Testverktøy for å sende inn søknader uten å fylle dem ut for hånd. Se README.md i denne mappen.
 *
 * Dette er det eneste søknaden importerer fra mappen. Koden for selve panelet lastes bare ned der panelet skal vises.
 */
export function Preutfylling() {
    if (!skalVisePreutfylling(window.location)) {
        return null;
    }
    return (
        <Feilgrense>
            <Suspense fallback={null}>
                <Preutfyllingspanel />
            </Suspense>
        </Feilgrense>
    );
}
