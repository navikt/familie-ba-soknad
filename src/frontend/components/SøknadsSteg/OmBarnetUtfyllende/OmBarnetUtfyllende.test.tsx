import React from 'react';

import { act, render } from '@testing-library/react';

import { ESvar } from '@navikt/familie-form-elements';
import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import { RoutesProvider } from '../../../routing/RoutesContext';
import { barnDataKeySpørsmål } from '../../../typer/person';
import { silenceConsoleErrors, spyOnUseApp } from '../../../utils/testing';
import OmBarnetUtfyllende from './OmBarnetUtfyllende';

jest.mock('../../../context/AppContext');

const history = ['/barnet/barn-1'];

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: history[history.length - 1],
    }),
    useHistory: () => history,
}));

silenceConsoleErrors();

test(`Kan rendre Om Barnet Utfyllende`, () => {
    spyOnUseApp({
        barnInkludertISøknaden: [
            {
                navn: 'Jens',
                [barnDataKeySpørsmål.erFosterbarn]: ESvar.NEI,
                [barnDataKeySpørsmål.oppholderSegIInstitusjon]: ESvar.JA,
            },
            {
                navn: 'Line',
                [barnDataKeySpørsmål.erFosterbarn]: ESvar.NEI,
                [barnDataKeySpørsmål.oppholderSegIInstitusjon]: ESvar.NEI,
            },
        ],
    });
    render(
        <SprakProvider tekster={{}} defaultLocale={LocaleType.nb}>
            <HttpProvider>
                <RoutesProvider>
                    <OmBarnetUtfyllende />
                </RoutesProvider>
            </HttpProvider>
        </SprakProvider>
    );
});

test(`Kan navigere mellom barn og til oppsummering`, () => {
    spyOnUseApp({
        barnInkludertISøknaden: [
            {
                navn: 'Jens',
                [barnDataKeySpørsmål.erFosterbarn]: ESvar.NEI,
                [barnDataKeySpørsmål.oppholderSegIInstitusjon]: ESvar.JA,
            },
            {
                navn: 'Line',
                [barnDataKeySpørsmål.erFosterbarn]: ESvar.NEI,
                [barnDataKeySpørsmål.oppholderSegIInstitusjon]: ESvar.NEI,
            },
        ],
    });

    const { getByText, rerender } = render(
        <SprakProvider
            tekster={{ nb: { 'ombarnet-utfyllende.tittel': 'Om {navn}' } }}
            defaultLocale={LocaleType.nb}
        >
            <HttpProvider>
                <RoutesProvider>
                    <OmBarnetUtfyllende />
                </RoutesProvider>
            </HttpProvider>
        </SprakProvider>
    );

    const jensTittel = getByText('Om Jens');
    expect(jensTittel).toBeInTheDocument();

    const gåVidere = getByText(/felles.gåvidere/);
    act(() => gåVidere.click());
    rerender(
        <SprakProvider
            tekster={{ nb: { 'ombarnet-utfyllende.tittel': 'Om {navn}' } }}
            defaultLocale={LocaleType.nb}
        >
            <HttpProvider>
                <RoutesProvider>
                    <OmBarnetUtfyllende />
                </RoutesProvider>
            </HttpProvider>
        </SprakProvider>
    );

    const lineTittel = getByText('Om Line');
    expect(lineTittel).toBeInTheDocument();

    act(() => gåVidere.click());
    expect(history[history.length - 1]).toEqual('/oppsummering');
});
