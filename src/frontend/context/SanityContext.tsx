import { Page } from '@navikt/ds-react';
import { createContext, type PropsWithChildren, useContext } from 'react';
import type { ESanitySteg } from '../../common/sanity';
import { Feilside } from '../components/Felleskomponenter/Feilside/Feilside';
import SystemetLaster from '../components/Felleskomponenter/SystemetLaster/SystemetLaster';
import { useHentSanityTekster } from '../hooks/useHentSanityTekster';
import type { ITekstinnhold } from '../typer/sanity/tekstInnhold';

interface SanityContext {
    tekster: ITekstinnhold;
}

const SanityContext = createContext<SanityContext | undefined>(undefined);

export function SanityProvider({ children }: PropsWithChildren) {
    const { data, isPending, error } = useHentSanityTekster();

    if (isPending) {
        return (
            <main>
                <Page.Block width={'text'} gutters={true}>
                    <SystemetLaster />
                </Page.Block>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <Page.Block width={'text'} gutters={true}>
                    <Feilside />
                </Page.Block>
            </main>
        );
    }

    return <SanityContext.Provider value={{ tekster: data }}>{children}</SanityContext.Provider>;
}

export function useSanityContext() {
    const context = useContext(SanityContext);
    if (context === undefined) {
        throw new Error('useSanityContext må brukes innenfor en SanityProvider');
    }
    return context;
}

export function useSanityTekster<T extends ESanitySteg>(steg: T): ITekstinnhold[T] {
    const { tekster } = useSanityContext();
    return tekster[steg];
}
