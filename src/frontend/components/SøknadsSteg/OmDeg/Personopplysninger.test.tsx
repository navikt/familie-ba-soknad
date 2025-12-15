import React from 'react';

import { render } from '@testing-library/react';

import { ESivilstand } from '../../../../common/typer/kontrakt/generelle';
import { SpråkProvider } from '../../../context/SpråkContext';
import { ISøker } from '../../../typer/person';
import { CookiesProviderMedLocale, spyOnUseApp, TestProvidere } from '../../../utils/testing';

import { Personopplysninger } from './Personopplysninger';

const mockedSivilstand = ESivilstand.GIFT;

describe('Personopplysninger', () => {
    test('Rendrer adresse i personopplysninger', async () => {
        const søker: Partial<ISøker> = {
            adresse: {
                adressenavn: 'Testgata',
                poststed: 'Oslo',
            },
            navn: 'Test Testdottir',
            statsborgerskap: [{ landkode: 'NOR' }],
            ident: '12345678901',
            barn: [],
            sivilstand: { type: mockedSivilstand },
        };

        spyOnUseApp({ søker });

        const { getByText } = render(
            <CookiesProviderMedLocale>
                <SpråkProvider>
                    <Personopplysninger />
                </SpråkProvider>
            </CookiesProviderMedLocale>
        );
        expect(getByText(/Testgata/)).toBeInTheDocument();
        expect(getByText(/Oslo/)).toBeInTheDocument();
    });

    test('Kan rendre med tom adresse', () => {
        const søker: Partial<ISøker> = {
            adresse: undefined,
            navn: 'Test Testdottir',
            statsborgerskap: [{ landkode: 'NOR' }],
            ident: '12345678901',
            barn: [],
            sivilstand: { type: mockedSivilstand },
        };

        spyOnUseApp({ søker });

        const { queryByText, queryByTestId } = render(
            <CookiesProviderMedLocale>
                <SpråkProvider>
                    <Personopplysninger />
                </SpråkProvider>
            </CookiesProviderMedLocale>
        );
        expect(queryByText('123456 78901')).toBeInTheDocument();
        expect(queryByTestId('adressevisning-ikke-registrert')).toBeInTheDocument();
    });

    test('Viser riktig info og stopper søknad ved adressebeskyttelse', () => {
        const søker: Partial<ISøker> = {
            adresse: undefined,
            navn: 'Test Testdottir',
            statsborgerskap: [{ landkode: 'NOR' }],
            ident: '12345678901',
            barn: [],
            sivilstand: { type: mockedSivilstand },
            adressebeskyttelse: true,
        };

        spyOnUseApp({ søker });

        const { getByTestId } = render(
            <TestProvidere>
                <Personopplysninger />
            </TestProvidere>
        );
        expect(getByTestId('adressevisning-sperre')).toBeInTheDocument();
    });
});
