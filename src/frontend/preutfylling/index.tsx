import { lazy, Suspense } from 'react';

import { Feilgrense } from './Feilgrense';
import { skalVisePreutfylling } from './skalVisePreutfylling';

const Preutfyllingspanel = lazy(() => import('./Preutfyllingspanel'));

// Testverktøy som bare vises i testmiljø. Se README.md i denne mappen.
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
