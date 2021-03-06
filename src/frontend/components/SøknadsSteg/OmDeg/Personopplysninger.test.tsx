import React from 'react';

import { render } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { IntlProvider } from 'react-intl';

import { LocaleType } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import { preferredAxios } from '../../../context/axios';
import { ESivilstand, ISøker } from '../../../typer/person';
import { silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import { Personopplysninger } from './Personopplysninger';

const axiosMock = new MockAdapter(preferredAxios);

axiosMock.onGet('/api/innlogget').reply(200, {
    status: RessursStatus.SUKSESS,
    data: 'Autentisert kall',
});

const mockedSivilstand = ESivilstand.GIFT;

silenceConsoleErrors();

describe('Personopplysninger', () => {
    test('Rendrer adresse i personopplysninger', () => {
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
            <IntlProvider locale={LocaleType.nb}>
                <Personopplysninger />
            </IntlProvider>
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

        const { getByText } = render(
            <IntlProvider locale={LocaleType.nb}>
                <Personopplysninger />
            </IntlProvider>
        );

        expect(getByText(/12345678901/)).toBeInTheDocument();
        expect(getByText(/omdeg\.personopplysninger\.adresse-ukjent/)).toBeInTheDocument();
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

        const { getByText } = render(
            <TestProvidere>
                <Personopplysninger />
            </TestProvidere>
        );

        expect(getByText(/omdeg\.personopplysninger\.adresse-sperret/)).toBeInTheDocument();
    });
});
