import React from 'react';

import { act, render } from '@testing-library/react';

import { ESvar } from '@navikt/familie-form-elements';
import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import { silenceConsoleErrors, spyOnUseApp } from '../../../utils/testing';
import OmBarnetUtfyllende from './OmBarnetUtfyllende';

jest.mock('../../../context/AppContext');

const history = ['/barnet/Jens'];

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
                oppholderSegIInstitusjon: ESvar.JA,
            },
            {
                navn: 'Line',
                oppholderSegIInstitusjon: ESvar.NEI,
            },
        ],
    });
    render(
        <HttpProvider>
            <SprakProvider tekster={{}} defaultLocale={LocaleType.nb}>
                <OmBarnetUtfyllende />
            </SprakProvider>
        </HttpProvider>
    );
});

test(`Kan navigere mellom barn og til oppsummering`, () => {
    spyOnUseApp({
        barnInkludertISøknaden: [
            {
                navn: 'Jens',
                oppholderSegIInstitusjon: ESvar.NEI,
            },
            {
                navn: 'Line',
                oppholderSegIInstitusjon: ESvar.NEI,
            },
        ],
    });

    const { getByText, rerender } = render(
        <HttpProvider>
            <SprakProvider
                tekster={{ nb: { 'ombarnet-utfyllende.tittel': 'Om {navn}' } }}
                defaultLocale={LocaleType.nb}
            >
                <OmBarnetUtfyllende />
            </SprakProvider>
        </HttpProvider>
    );

    const jensTittel = getByText('Om Jens');
    expect(jensTittel).toBeInTheDocument();

    const gåVidere = getByText(/felles.gåvidere/);
    act(() => gåVidere.click());
    rerender(
        <HttpProvider>
            <SprakProvider
                tekster={{ nb: { 'ombarnet-utfyllende.tittel': 'Om {navn}' } }}
                defaultLocale={LocaleType.nb}
            >
                <OmBarnetUtfyllende />
            </SprakProvider>
        </HttpProvider>
    );

    const lineTittel = getByText('Om Line');
    expect(lineTittel).toBeInTheDocument();

    act(() => gåVidere.click());
    expect(history[history.length - 1]).toEqual('/oppsummering');
});
