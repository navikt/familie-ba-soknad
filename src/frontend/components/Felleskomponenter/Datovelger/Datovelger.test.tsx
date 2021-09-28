import React from 'react';

import { act, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import dayjs from 'dayjs';
import { mockDeep } from 'jest-mock-extended';
import { IntlProvider } from 'react-intl';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { ISkjema, useFelt } from '@navikt/familie-skjema';

import { SkjemaFeltTyper } from '../../../typer/skjema';
import {
    mekkGyldigSøknad,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import OmDeg from '../../SøknadsSteg/OmDeg/OmDeg';
import { OmDegSpørsmålId } from '../../SøknadsSteg/OmDeg/spørsmål';
import Datovelger from './Datovelger';

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

describe(`Datovelger`, () => {
    silenceConsoleErrors();
    test(`Datovelger kan begrenses av annen datovelger`, () => {
        const {
            result: { current },
        } = renderHook(
            () => {
                const fraOgMed = useFelt<ISODateString>({
                    verdi: '2020-02-04',
                    feltId: 'fra-og-med',
                });
                const tilOgMed = useFelt<ISODateString>({
                    verdi: '2020-02-04',
                    feltId: 'til-og-med',
                });
                return {
                    fraOgMed,
                    tilOgMed,
                };
            },
            { wrapper: IntlProvider, initialProps: { locale: 'nb' } }
        );

        const skjemaMock = mockDeep<ISkjema<SkjemaFeltTyper, string>>({
            visFeilmeldinger: true,
        });

        const { getAllByRole, container, rerender } = render(
            <TestProvidere>
                <Datovelger
                    felt={current.fraOgMed}
                    skjema={skjemaMock}
                    labelTekstId={'test-fra-og-med'}
                />
                <Datovelger
                    felt={current.tilOgMed}
                    fraOgMedFelt={current.fraOgMed}
                    skjema={skjemaMock}
                    labelTekstId={'test-til-og-med'}
                />
            </TestProvidere>
        );

        const tilOgMedÅpneknapp = getAllByRole('button')[1];
        act(() => tilOgMedÅpneknapp.click());
        const forrigeDag = container.querySelector('[aria-selected="true"]')
            ?.previousElementSibling;
        expect(forrigeDag?.getAttribute('aria-disabled')).toEqual('true');

        // Lukk denne datovelgeren for å resette før neste del av testen
        act(() => tilOgMedÅpneknapp.click());

        // Samme oppsett men tester avgrensning fremover
        rerender(
            <TestProvidere>
                <Datovelger
                    felt={current.tilOgMed}
                    skjema={skjemaMock}
                    labelTekstId={'test-til-og-med'}
                />
                <Datovelger
                    felt={current.fraOgMed}
                    tilOgMedFelt={current.tilOgMed}
                    skjema={skjemaMock}
                    labelTekstId={'test-fra-og-med'}
                />
            </TestProvidere>
        );

        const fraOgMedÅpneknapp = getAllByRole('button')[1];
        act(() => fraOgMedÅpneknapp.click());
        const nesteDag = container.querySelector('[aria-selected="true"]')?.nextElementSibling;
        expect(nesteDag?.getAttribute('aria-disabled')).toEqual('true');
    });
});

describe('Test ulike caser for feilmelding hos datovelger', () => {
    const søknad = mekkGyldigSøknad();
    const søknadMock = {
        ...søknad,
        søker: {
            ...søknad.søker,
            adressebeskyttelse: true,
            statsborgerskap: [{ landkode: 'NOR' }],
            oppholderSegINorge: {
                id: OmDegSpørsmålId.oppholderSegINorge,
                svar: ESvar.NEI,
            },
        },
    };

    it('Datovelger viser spesifikk feilmelding for felt dersom verdien er tom', () => {
        spyOnUseApp({
            ...søknadMock,
            søker: {
                ...søknadMock.søker,
                oppholdslandDato: { id: OmDegSpørsmålId.oppholdslandDato, svar: '' },
            },
        });

        const { getAllByText, getByText } = render(
            <TestProvidereMedEkteTekster>
                <OmDeg />
            </TestProvidereMedEkteTekster>
        );
        const gåVidere = getByText('GÅ VIDERE');
        act(() => gåVidere.click());
        const feilmelding = getAllByText(
            'Du må oppgi når utenlandsoppholdet begynte for å gå videre'
        );
        expect(feilmelding).toHaveLength(2);
    });

    it('Datovelger viser feilmelding for ugyldig valg av dato frem i tid', () => {
        spyOnUseApp({
            ...søknadMock,
            søker: {
                ...søknadMock.søker,
                oppholdslandDato: {
                    id: OmDegSpørsmålId.oppholdslandDato,
                    svar: dayjs().add(1, 'day').format('YYYY-MM-DD'),
                },
            },
        });

        const { getAllByText, getByText } = render(
            <TestProvidereMedEkteTekster>
                <OmDeg />
            </TestProvidereMedEkteTekster>
        );
        const gåVidere = getByText('GÅ VIDERE');
        act(() => gåVidere.click());
        const feilmelding = getAllByText('Dato kan ikke være frem i tid');
        expect(feilmelding).toHaveLength(2);
    });

    it('Datovelger viser feilmelding for ugyldig format', () => {
        spyOnUseApp({
            ...søknadMock,
            søker: {
                ...søknadMock.søker,
                oppholdslandDato: {
                    id: OmDegSpørsmålId.oppholdslandDato,
                    svar: 'abc',
                },
            },
        });

        const { getAllByText, getByText } = render(
            <TestProvidereMedEkteTekster>
                <OmDeg />
            </TestProvidereMedEkteTekster>
        );
        const gåVidere = getByText('GÅ VIDERE');
        act(() => gåVidere.click());
        const feilmelding = getAllByText('Dato må være en gyldig dato i formatet dd.mm.åååå');
        expect(feilmelding).toHaveLength(2);
    });
});
