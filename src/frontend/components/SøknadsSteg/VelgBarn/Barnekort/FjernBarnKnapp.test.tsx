import React from 'react';

import { act, render } from '@testing-library/react';

import { ESivilstand, ESøknadstype } from '../../../../typer/kontrakt/generelle';
import { IBarn } from '../../../../typer/person';
import {
    mekkGyldigSøker,
    mockEøs,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
} from '../../../../utils/testing';
import VelgBarn from '../VelgBarn';

describe('FjernBarnKnapp', () => {
    beforeEach(() => {
        mockEøs();
    });

    test(`Kan fjern-knapp dukker kun opp på manuelt registrerte barn`, () => {
        silenceConsoleErrors();

        const registrertBarn: IBarn = {
            id: 'random-id-manuell',
            ident: '12345',
            navn: 'Test',
            borMedSøker: true,
            alder: null,
            adressebeskyttelse: false,
        };
        const pdlBarn: IBarn = {
            id: 'random-id-pdl',
            ident: '54321',
            navn: 'Også test',
            borMedSøker: true,
            alder: null,
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
            <TestProvidere mocketNettleserHistorikk={['/velg-barn']}>
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
            id: 'random-id',
            ident: '12345',
            navn: 'Test',
            borMedSøker: true,
            alder: null,
            adressebeskyttelse: false,
        };

        const { settSøknad } = spyOnUseApp({
            barnInkludertISøknaden: [],
            søker: {
                barn: [],
            },
            barnRegistrertManuelt: [registrertBarn],
            dokumentasjon: [],
            søknadstype: ESøknadstype.ORDINÆR,
        });
        const { getByText } = render(
            <TestProvidere mocketNettleserHistorikk={['/velg-barn']}>
                <VelgBarn />
            </TestProvidere>
        );

        const fjernKnapp = getByText(/hvilkebarn.fjern-barn.knapp/);
        act(() => fjernKnapp.click());

        expect(settSøknad).toHaveBeenCalledTimes(1);
        expect(settSøknad).toHaveBeenCalledWith({
            barnInkludertISøknaden: [],
            barnRegistrertManuelt: [],
            erEøs: false,
            dokumentasjon: [],
            søker: {
                ...mekkGyldigSøker(),
                barn: [],
                sivilstand: { type: ESivilstand.UGIFT },
            },
            søknadstype: ESøknadstype.ORDINÆR,
        });
    });
});
