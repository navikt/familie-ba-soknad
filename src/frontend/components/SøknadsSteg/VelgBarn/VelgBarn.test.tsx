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

        const { getByText } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );
        const fjernBarnKnapp = getByText(/hvilkebarn.fjern-barn.knapp/);

        act(() => fjernBarnKnapp.click());

        const gåVidere = getByText(/felles.navigasjon.gå-videre/);
        act(() => gåVidere.click());

        // Først blir barnet fjernet fra manuelt registrerte barn
        expect(settSøknad).toHaveBeenNthCalledWith(1, {
            barnRegistrertManuelt: [],
            barnInkludertISøknaden: [manueltRegistrert, fraPdl],
            søker: { barn: [fraPdl] },
        });

        // Når man trykker på gå videre blir det manuelt registrerte barnet fjernet fra søknaden
        expect(settSøknad).toHaveBeenNthCalledWith(2, {
            barnRegistrertManuelt: [],
            barnInkludertISøknaden: [fraPdl],
            søker: { barn: [fraPdl] },
        });
    });
});
