import React from 'react';

import { act, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { mockDeep } from 'jest-mock-extended';
import { IntlProvider } from 'react-intl';

import { ISODateString } from '@navikt/familie-form-elements';
import { ISkjema, useFelt } from '@navikt/familie-skjema';

import { SkjemaFeltTyper } from '../../../typer/skjema';
import { silenceConsoleErrors, TestProvidere } from '../../../utils/testing';
import Datovelger from './Datovelger';

describe(`Datovelger`, () => {
    test(`Datovelger kan begrenses av annen datovelger`, () => {
        silenceConsoleErrors();
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
