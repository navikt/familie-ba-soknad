import React from 'react';

import { render, screen } from '@testing-library/react';

import navFarger from 'nav-frontend-core';

import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import norskeTekster from '../../../assets/lang/nb.json';
import { AppProvider } from '../../../context/AppContext';
import { RoutesProvider } from '../../../context/RoutesContext';
import { bekreftelseBoksBorderFarge } from './BekreftelseOgStartSoknad';
import Forside from './Forside';
import { BekreftelseStatus } from './useBekreftelseOgStartSoknad';

beforeEach(() => {
    jest.spyOn(global.console, 'error');
});

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: 'localhost:3000/example/path',
    }),
}));

test('Kan rendre Forside', () => {
    render(
        <SprakProvider tekster={{ nb: norskeTekster }} defaultLocale={LocaleType.nb}>
            <AppProvider>
                <RoutesProvider>
                    <Forside />
                </RoutesProvider>
            </AppProvider>
        </SprakProvider>
    );
    expect(screen.getByText('Velkommen til barnetrygdsøknaden')).toBeInTheDocument();
});

// TODO: Bug med Node og intl-versjon. Disabler testen til det er fikset.
/*test('Alle tekster finnes i språkfil', () => {
    render(
        <SprakProvider tekster={{ nb: norskeTekster }} defaultLocale={LocaleType.nb}>
            <AppProvider>
                <RoutesProvider>
                    <Forside />
                </RoutesProvider>
            </AppProvider>
        </SprakProvider>
    );
    expect(console.error).toHaveBeenCalledTimes(0);
});*/

test('Return riktig borderfarge basert på status', () => {
    expect(bekreftelseBoksBorderFarge(BekreftelseStatus.FEIL)).toEqual(navFarger.navRod);
    expect(bekreftelseBoksBorderFarge(BekreftelseStatus.BEKREFTET)).toEqual(navFarger.navGronn);
    expect(bekreftelseBoksBorderFarge(BekreftelseStatus.NORMAL)).toEqual(navFarger.navOransje);
});
