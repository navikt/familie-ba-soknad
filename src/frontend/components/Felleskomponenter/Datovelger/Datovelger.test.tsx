import React from 'react';

import { act, render, renderHook } from '@testing-library/react';
import { formatISO } from 'date-fns';
import { mockDeep } from 'jest-mock-extended';
import { IntlProvider } from 'react-intl';

import { type ISkjema, useFelt } from '@navikt/familie-skjema';

import { ISODateString } from '../../../typer/common';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import * as datoUtils from '../../../utils/dato';
import { dagensDato } from '../../../utils/dato';
import { silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';

import Datovelger from './Datovelger';

class ResizeObserver {
    observe() {
        // do nothing
    }
    unobserve() {
        // do nothing
    }
    disconnect() {
        // do nothing
    }
}

const IntlProviderMedLocale = ({ children }) => <IntlProvider locale="nb">{children}</IntlProvider>;

describe('Datovelger', () => {
    beforeEach(() => {
        spyOnUseApp({});
        silenceConsoleErrors();
        window.ResizeObserver = ResizeObserver;
    });
    test('Datovelger kan begrenses av annen fra om med datovelger', () => {
        const {
            result: { current },
        } = renderHook(
            () => {
                const fraOgMed = useFelt<ISODateString>({
                    verdi: '2021-09-10',
                    feltId: 'fra-og-med',
                });
                const tilOgMed = useFelt<ISODateString>({
                    verdi: '2021-09-10',
                    feltId: 'til-og-med',
                });
                return {
                    fraOgMed,
                    tilOgMed,
                };
            },
            { wrapper: IntlProviderMedLocale }
        );

        const skjemaMock = mockDeep<ISkjema<SkjemaFeltTyper, string>>({
            visFeilmeldinger: true,
        });

        const { getAllByRole } = render(
            <TestProvidere>
                <Datovelger felt={current.fraOgMed} skjema={skjemaMock} label={'test-fra-og-med'} />
                <Datovelger
                    felt={current.tilOgMed}
                    tilhørendeFraOgMedFelt={current.fraOgMed}
                    skjema={skjemaMock}
                    label={'test-til-og-med'}
                />
            </TestProvidere>
        );

        const [, tilOgMedÅpneknapp] = getAllByRole('button');
        act(() => tilOgMedÅpneknapp.click());

        const [tilOgMedKalender] = getAllByRole('dialog');

        const forrigeDag = tilOgMedKalender.querySelector('[aria-label="torsdag 9"]');

        expect(forrigeDag).toBeDisabled();
    });

    it('kan avgrenses frem i tid', () => {
        jest.spyOn(datoUtils, 'dagensDato').mockReturnValue(new Date('2021-09-10'));
        const {
            result: { current },
        } = renderHook(
            () => {
                const tilOgMed = useFelt<ISODateString>({
                    verdi: formatISO(dagensDato()),
                    feltId: 'til-og-med',
                });
                return {
                    tilOgMed,
                };
            },
            { wrapper: IntlProviderMedLocale }
        );

        const skjemaMock = mockDeep<ISkjema<SkjemaFeltTyper, string>>({
            visFeilmeldinger: true,
        });

        const { getByRole, container } = render(
            <TestProvidere>
                <Datovelger
                    felt={current.tilOgMed}
                    skjema={skjemaMock}
                    label={'test-til-og-med'}
                    avgrensDatoFremITid={true}
                />
            </TestProvidere>
        );

        const datovelgerÅpneKnapp = getByRole('button');

        act(() => datovelgerÅpneKnapp.click());
        const nesteDag = container.querySelector('[aria-label="lørdag 11"]');
        expect(nesteDag).toBeDisabled();
    });
});
