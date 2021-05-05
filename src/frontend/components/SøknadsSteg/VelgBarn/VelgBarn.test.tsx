import React from 'react';

import { act, render } from '@testing-library/react';

import { ISøknad } from '../../../typer/søknad';
import { silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import VelgBarn from './VelgBarn';

describe('VelgBarn', () => {
    test('Kan fjerne manuelt registrerte barn', () => {
        silenceConsoleErrors();
        const manueltRegistrert = {
            ident: '12345',
            navn: 'A',
        };
        const fraPdl = {
            ident: '54321',
            navn: 'B',
        };
        const søknad = {
            barnRegistrertManuelt: [manueltRegistrert],
            barnInkludertISøknaden: [manueltRegistrert, fraPdl],
            søker: { barn: [fraPdl] },
        };
        const { settSøknad } = spyOnUseApp(søknad);

        settSøknad.mockImplementation((nySøknad: ISøknad) => {
            søknad.barnRegistrertManuelt = nySøknad.barnRegistrertManuelt;
            søknad.barnInkludertISøknaden = nySøknad.barnInkludertISøknaden;
        });

        const { getByText, rerender } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );
        const fjernBarnKnapp = getByText(/hvilkebarn.fjern-barn.knapp/);

        act(() => fjernBarnKnapp.click());
        // Vet ikke hvorfor, men uten denne rerenderen trigger ikke useEffecten i useVelgBarn
        rerender(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );

        const gåVidere = getByText(/felles.navigasjon.gå-videre/);
        act(() => gåVidere.click());

        expect(søknad.barnInkludertISøknaden.length).toBe(1);
    });
});
