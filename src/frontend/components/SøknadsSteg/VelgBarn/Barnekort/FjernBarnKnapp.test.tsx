import React from 'react';

import { act, render } from '@testing-library/react';

import { IBarn } from '../../../../typer/person';
import { silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../../utils/testing';
import VelgBarn from '../VelgBarn';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: '/velg-barn',
    }),
    useHistory: () => ({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        push: () => {},
    }),
}));

describe('FjernBarnKnapp', () => {
    test(`Kan fjern-knapp dukker kun opp på manuelt registrerte barn`, () => {
        silenceConsoleErrors();

        const registrertBarn: IBarn = {
            ident: '12345',
            navn: 'Test',
            borMedSøker: true,
            alder: undefined,
            adressebeskyttelse: false,
        };
        const pdlBarn: IBarn = {
            ident: '54321',
            navn: 'Også test',
            borMedSøker: true,
            alder: undefined,
            adressebeskyttelse: false,
        };

        spyOnUseApp({
            barnInkludertISøknaden: [],
            søker: {
                barn: [pdlBarn],
            },
            barnRegistrertManuelt: [registrertBarn],
        });
        const { getAllByText } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );

        const fnrLabels = getAllByText(/hvilkebarn.barn.fødselsnummer/);
        expect(fnrLabels.length).toBe(2);

        const fjernKnapper = getAllByText(/hvilkebarn.fjern-barn.knapp/);
        expect(fjernKnapper.length).toBe(1);
    });

    test('Kan fjerne barn', () => {
        silenceConsoleErrors();

        const registrertBarn: IBarn = {
            ident: '12345',
            navn: 'Test',
            borMedSøker: true,
            alder: undefined,
            adressebeskyttelse: false,
        };

        const { settSøknad } = spyOnUseApp({
            barnInkludertISøknaden: [],
            søker: {
                barn: [],
            },
            barnRegistrertManuelt: [registrertBarn],
        });
        const { getByText } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );

        const fjernKnapp = getByText(/hvilkebarn.fjern-barn.knapp/);
        act(() => fjernKnapp.click());

        expect(settSøknad).toHaveBeenCalledTimes(1);
        expect(settSøknad).toHaveBeenCalledWith({
            barnInkludertISøknaden: [],
            barnRegistrertManuelt: [],
            søker: {
                barn: [],
            },
        });
    });
});
