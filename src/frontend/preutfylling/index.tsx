import { lazy, Suspense } from 'react';

const Preutfyllingspanel = lazy(() => import('./Preutfyllingspanel'));

// Tillatelsesliste i stedet for «ikke prod», slik at panelet aldri vises på et vertsnavn vi ikke kjenner.
const erTestmiljø = () => {
    const { hostname } = window.location;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.dev.nav.no');
};

/**
 * Testverktøy for å sende inn søknader uten å fylle dem ut for hånd. All koden ligger i denne mappen, og koden for
 * selve panelet lastes bare ned i testmiljø.
 */
export function Preutfylling() {
    if (!erTestmiljø()) {
        return null;
    }
    return (
        <Suspense fallback={null}>
            <Preutfyllingspanel />
        </Suspense>
    );
}
