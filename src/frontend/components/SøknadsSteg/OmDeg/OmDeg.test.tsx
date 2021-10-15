import React from 'react';

import { act, render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { ISøker } from '../../../typer/person';
import {
    mockEøs,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import OmDeg from './OmDeg';
import { omDegSpørsmålSpråkId } from './spørsmål';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: '/om-deg',
    }),
    useHistory: () => ({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        push: () => {},
    }),
}));

jest.mock('nav-frontend-alertstriper', () => ({ children }) => (
    <div data-testid="alertstripe">{children}</div>
));

describe('OmDeg', () => {
    silenceConsoleErrors();
    beforeEach(() => {
        mockEøs();
    });
    test('Alle tekster finnes i språkfil', () => {
        render(
            <TestProvidereMedEkteTekster>
                <OmDeg />
            </TestProvidereMedEkteTekster>
        );
        expect(console.error).toHaveBeenCalledTimes(0);
    });

    test('Skal rendre alertstripe i OmDeg', () => {
        const { getByTestId } = render(
            <TestProvidereMedEkteTekster>
                <OmDeg />
            </TestProvidereMedEkteTekster>
        );
        expect(getByTestId(/alertstripe/)).toBeInTheDocument();
    });

    test('Viser adressesperre-melding', () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adresse: undefined,
                adressebeskyttelse: true,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        const { getByText } = render(
            <TestProvidere>
                <OmDeg />
            </TestProvidere>
        );

        expect(getByText(/omdeg.personopplysninger.adresse-sperret/)).toBeInTheDocument();
        expect(getByText(/omdeg.personopplysninger.adressesperre.alert/)).toBeInTheDocument();
    });

    test('Kan ikke gå videre i søknad ved adresse som er ukjent', () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adresse: undefined,
                adressebeskyttelse: false,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        const { queryByText } = render(
            <TestProvidere>
                <OmDeg />
            </TestProvidere>
        );

        expect(
            queryByText(omDegSpørsmålSpråkId['bor-på-registrert-adresse'])
        ).not.toBeInTheDocument();
    });

    test('Kan gå videre hvis søker har adresse og ikke sperre', () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adressebeskyttelse: false,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        const { queryByText, getByText } = render(
            <TestProvidere>
                <OmDeg />
            </TestProvidere>
        );

        expect(queryByText(omDegSpørsmålSpråkId['bor-på-registrert-adresse'])).toBeInTheDocument();

        const jaKnapp = getByText(/felles.svaralternativ.ja/);
        act(() => jaKnapp.click());

        expect(
            queryByText(omDegSpørsmålSpråkId['søker-oppholder-seg-i-norge'])
        ).toBeInTheDocument();
    });

    test('Søker med adressesperre får ikke opp spørsmål om bosted', () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adressebeskyttelse: true,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        const { queryByText } = render(
            <TestProvidere>
                <OmDeg />
            </TestProvidere>
        );

        expect(
            queryByText(omDegSpørsmålSpråkId['bor-på-registrert-adresse'])
        ).not.toBeInTheDocument();

        expect(
            queryByText(omDegSpørsmålSpråkId['søker-oppholder-seg-i-norge'])
        ).toBeInTheDocument();

        expect(
            queryByText(omDegSpørsmålSpråkId['søker-vært-i-norge-sammenhengende-tolv-måneder'])
        ).toBeInTheDocument();
    });
});
