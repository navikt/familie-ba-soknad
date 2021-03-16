import React from 'react';

import { render } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { mockDeep } from 'jest-mock-extended';
import { IntlProvider } from 'react-intl';

import { ISkjema } from '@navikt/familie-skjema';
import { LocaleType } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import * as appContext from '../../../context/AppContext';
import { preferredAxios } from '../../../context/axios';
import { ESivilstand } from '../../../typer/person';
import { Personopplysninger } from './Personopplysninger';
import { IStegEnFeltTyper } from './useOmdeg';

const axiosMock = new MockAdapter(preferredAxios);

axiosMock.onGet('/api/innlogget').reply(200, {
    status: RessursStatus.SUKSESS,
    data: 'Autentisert kall',
});

const mockedSivilstand = ESivilstand.GIFT;

jest.spyOn(global.console, 'error').mockImplementation(() => {
    // Shut up about the missing translations;
});
jest.mock('../../../context/AppContext');

test('Test at rendrer adresse i personopplysninger', () => {
    const skjema = mockDeep<ISkjema<IStegEnFeltTyper, string>>();
    const søker = {
        adresse: {
            adressenavn: 'Testgata',
            bostedskommune: 'Oslo',
        },
        navn: 'Test Testdottir',
        statsborgerskap: [{ landkode: 'NOR' }],
        ident: '12345678901',
        kontakttelefon: '40123456',
        barn: [],
        sivilstand: { type: mockedSivilstand },
    };

    jest.spyOn(appContext, 'useApp').mockImplementation(
        jest.fn().mockReturnValue({ søknad: { søker } })
    );

    const { getByText } = render(
        <IntlProvider locale={LocaleType.nb}>
            <Personopplysninger skjema={skjema} />
        </IntlProvider>
    );
    expect(getByText(/Testgata/)).toBeInTheDocument();
    expect(getByText(/Oslo/)).toBeInTheDocument();
});

test('Kan rendre med tom adresse', () => {
    const skjema = mockDeep<ISkjema<IStegEnFeltTyper, string>>();

    const søker = {
        adresse: null,
        navn: 'Test Testdottir',
        statsborgerskap: [{ landkode: 'NOR' }],
        ident: '12345678901',
        kontakttelefon: '40123456',
        barn: [],
        sivilstand: { type: mockedSivilstand },
    };

    jest.spyOn(appContext, 'useApp').mockImplementation(
        jest.fn().mockReturnValue({ søknad: { søker } })
    );

    const { getByText } = render(
        <IntlProvider locale={LocaleType.nb}>
            <Personopplysninger skjema={skjema} />
        </IntlProvider>
    );

    expect(getByText(/12345678901/)).toBeInTheDocument();
    expect(getByText(/personopplysninger\.info\.ukjentadresse/)).toBeInTheDocument();
});
