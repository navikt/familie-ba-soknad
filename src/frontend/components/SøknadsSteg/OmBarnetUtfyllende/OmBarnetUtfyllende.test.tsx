import React from 'react';

import { act, render } from '@testing-library/react';

import { ESvar } from '@navikt/familie-form-elements';
import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import { RoutesProvider } from '../../../context/RoutesContext';
import { AlternativtDatoSvar, barnDataKeySpørsmål } from '../../../typer/person';
import { silenceConsoleErrors, spyOnUseApp } from '../../../utils/testing';
import OmBarnetUtfyllende from './OmBarnetUtfyllende';

jest.mock('../../../context/AppContext');

let mockHistory = ['/om-barnet/barn-1'];

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: mockHistory[mockHistory.length - 1],
    }),
    useHistory: () => mockHistory,
}));

silenceConsoleErrors();

const jens = {
    navn: 'Jens',
    ident: '12345678910',
    [barnDataKeySpørsmål.erFosterbarn]: { id: '1', svar: ESvar.NEI },
    [barnDataKeySpørsmål.oppholderSegIInstitusjon]: { id: '2', svar: ESvar.JA },
    [barnDataKeySpørsmål.institusjonsnavn]: { id: '3', svar: 'narvesen' },
    [barnDataKeySpørsmål.institusjonsadresse]: { id: '4', svar: 'narvesen' },
    [barnDataKeySpørsmål.institusjonspostnummer]: { id: '5', svar: '2030' },
    [barnDataKeySpørsmål.institusjonOppholdStart]: { id: '6', svar: '2020-08-08' },
    [barnDataKeySpørsmål.institusjonOppholdSlutt]: {
        id: '7',
        svar: AlternativtDatoSvar.UKJENT,
    },
};
const line = {
    navn: 'Line',
    ident: '12345678911',
    [barnDataKeySpørsmål.erFosterbarn]: { id: '', svar: ESvar.NEI },
    [barnDataKeySpørsmål.oppholderSegIInstitusjon]: { id: '', svar: ESvar.NEI },
    [barnDataKeySpørsmål.institusjonsnavn]: { id: '', svar: '' },
    [barnDataKeySpørsmål.institusjonsadresse]: { id: '', svar: '' },
    [barnDataKeySpørsmål.institusjonspostnummer]: { id: '', svar: '' },
    [barnDataKeySpørsmål.institusjonOppholdStart]: { id: '', svar: '' },
    [barnDataKeySpørsmål.institusjonOppholdSlutt]: {
        id: '',
        svar: '',
    },
};

test(`Kan rendre Om Barnet Utfyllende`, () => {
    spyOnUseApp({
        barnInkludertISøknaden: [jens],
        sisteUtfylteStegIndex: 4,
    });

    render(
        <SprakProvider tekster={{}} defaultLocale={LocaleType.nb}>
            <HttpProvider>
                <RoutesProvider>
                    <OmBarnetUtfyllende barnetsIdent={'12345678910'} />
                </RoutesProvider>
            </HttpProvider>
        </SprakProvider>
    );
});

test(`Kan navigere mellom to barn`, () => {
    spyOnUseApp({
        barnInkludertISøknaden: [jens, line],
        sisteUtfylteStegIndex: 4,
    });
    const { getByText } = render(
        <SprakProvider
            tekster={{ nb: { 'ombarnet.sidetittel': 'Om {navn}' } }}
            defaultLocale={LocaleType.nb}
        >
            <HttpProvider>
                <RoutesProvider>
                    <OmBarnetUtfyllende barnetsIdent={'12345678910'} />
                </RoutesProvider>
            </HttpProvider>
        </SprakProvider>
    );

    expect(mockHistory[mockHistory.length - 1]).toEqual('/om-barnet/barn-1');

    const jensTittel = getByText('Om Jens');
    expect(jensTittel).toBeInTheDocument();

    const gåVidere = getByText(/felles.navigasjon.gå-videre/);
    act(() => gåVidere.click());

    expect(mockHistory[mockHistory.length - 1]).toEqual('/om-barnet/barn-2');
});

test(`Kan navigere fra barn til oppsummering`, () => {
    mockHistory = ['/om-barnet/barn-1'];

    spyOnUseApp({
        barnInkludertISøknaden: [jens],
        sisteUtfylteStegIndex: 4,
    });

    const { getByText } = render(
        <SprakProvider
            tekster={{ nb: { 'ombarnet.sidetittel': 'Om {navn}' } }}
            defaultLocale={LocaleType.nb}
        >
            <HttpProvider>
                <RoutesProvider>
                    <OmBarnetUtfyllende barnetsIdent={'12345678910'} />
                </RoutesProvider>
            </HttpProvider>
        </SprakProvider>
    );

    expect(mockHistory[mockHistory.length - 1]).toEqual('/om-barnet/barn-1');

    const jensTittel = getByText('Om Jens');
    expect(jensTittel).toBeInTheDocument();

    const gåVidere = getByText(/felles.navigasjon.gå-videre/);
    act(() => gåVidere.click());

    expect(mockHistory[mockHistory.length - 1]).toEqual('/oppsummering');
});
