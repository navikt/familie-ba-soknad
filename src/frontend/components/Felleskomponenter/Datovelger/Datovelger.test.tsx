import React from 'react';

import { act, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { formatISO } from 'date-fns';
import { mockDeep } from 'jest-mock-extended';
import { IntlProvider } from 'react-intl';

import { ISkjema, useFelt } from '@navikt/familie-skjema';

import { ISODateString } from '../../../typer/common';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import * as datoUtils from '../../../utils/dato';
import { dagensDato } from '../../../utils/dato';
import { silenceConsoleErrors, spyOnModal, TestProvidere } from '../../../utils/testing';

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

describe('Datovelger', () => {
    silenceConsoleErrors();
    spyOnModal();
    window.ResizeObserver = ResizeObserver;
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
            { wrapper: IntlProvider, initialProps: { locale: 'nb' } }
        );

        const skjemaMock = mockDeep<ISkjema<SkjemaFeltTyper, string>>({
            visFeilmeldinger: true,
        });

        const { getAllByRole, container } = render(
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

        const tilOgMedÅpneknapp = getAllByRole('button')[1];
        act(() => tilOgMedÅpneknapp.click());
        const forrigeDag = container.querySelector('[aria-label="torsdag 9"]');

        expect(forrigeDag?.getAttribute('disabled')).not.toBeNull();
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
            { wrapper: IntlProvider, initialProps: { locale: 'nb' } }
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
        expect(nesteDag?.getAttribute('disabled')).not.toBeNull();
    });
});
