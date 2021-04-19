import React from 'react';

import { render } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { IntlProvider } from 'react-intl';

import { LocaleType } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import { preferredAxios } from '../../../context/axios';
import { ESivilstand } from '../../../typer/person';
import { silenceConsoleErrors, spyOnUseApp } from '../../../utils/testing';
import { Personopplysninger } from './Personopplysninger';

const axiosMock = new MockAdapter(preferredAxios);

axiosMock.onGet('/api/innlogget').reply(200, {
    status: RessursStatus.SUKSESS,
    data: 'Autentisert kall',
});

const mockedSivilstand = ESivilstand.GIFT;

silenceConsoleErrors();

test('Test at rendrer adresse i personopplysninger', () => {
    const søker = {
        adresse: {
            adressenavn: 'Testgata',
            poststed: 'Oslo',
        },
        navn: 'Test Testdottir',
        statsborgerskap: [{ landkode: 'NOR' }],
        ident: '12345678901',
        kontakttelefon: '40123456',
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
    const søker = {
        adresse: null,
        navn: 'Test Testdottir',
        statsborgerskap: [{ landkode: 'NOR' }],
        ident: '12345678901',
        kontakttelefon: '40123456',
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
    expect(getByText(/personopplysninger\.har-ikke-registrert-adresse/)).toBeInTheDocument();
});
