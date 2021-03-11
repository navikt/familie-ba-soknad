import React from 'react';

import { render, screen } from '@testing-library/react';

import { SprakProvider, LocaleType } from '@navikt/familie-sprakvelger';

import norskeTekster from '../../assets/lang/nb.json';
import { AppProvider } from '../../context/AppContext';
import Forside from './Forside';

beforeEach(() => {
    jest.spyOn(global.console, 'error');
});

test('Kan rendre Forside', () => {
    render(
        <SprakProvider tekster={{ nb: norskeTekster }} defaultLocale={LocaleType.nb}>
            <AppProvider>
                <Forside />
            </AppProvider>
        </SprakProvider>
    );
    expect(screen.getByText('Velkommen til barnetrygdsøknaden')).toBeInTheDocument();
});

test('Alle tekster finnes i språkfil', () => {
    render(
        <SprakProvider tekster={{ nb: norskeTekster }} defaultLocale={LocaleType.nb}>
            <AppProvider>
                <Forside />
            </AppProvider>
        </SprakProvider>
    );
    expect(console.error).toHaveBeenCalledTimes(0);
});
