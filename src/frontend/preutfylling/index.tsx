import { lazy, Suspense } from 'react';

import { Feilgrense } from './Feilgrense';
import { skalVisePreutfylling } from './skalVisePreutfylling';

const Preutfyllingspanel = lazy(() =>
    import('./Preutfyllingspanel').then(modul => ({ default: modul.Preutfyllingspanel }))
);

export function PreutfyllingITestmiljø() {
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
