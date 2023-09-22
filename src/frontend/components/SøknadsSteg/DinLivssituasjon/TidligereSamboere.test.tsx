import React from 'react';

import { render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';

import { ESivilstand, ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ISøknad } from '../../../typer/søknad';
import { silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';

import DinLivssituasjon from './DinLivssituasjon';
import {
    DinLivssituasjonSpørsmålId,
    samboerSpråkIder,
    TidligereSamboerSpørsmålId,
} from './spørsmål';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: '/din-livssituasjon',
    }),
    useHistory: () => ({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        push: () => {},
    }),
}));

const søknad = mockDeep<ISøknad>({
    søknadstype: ESøknadstype.UTVIDET,
    barnInkludertISøknaden: [
        {
            ident: '1234',
        },
    ],
    søker: {
        sivilstand: { type: ESivilstand.SKILT },
        nåværendeSamboer: {
            navn: { svar: '' },
            ident: { svar: '' },
            fødselsdato: { svar: '' },
            samboerFraDato: { svar: '' },
        },
        harSamboerNå: {
            id: DinLivssituasjonSpørsmålId.harSamboerNå,
            svar: ESvar.JA,
        },
        utvidet: {
            spørsmål: {
                årsak: { svar: '' },
            },
            tidligereSamboere: [],
        },
    },
});

describe('TidligereSamboere', () => {
    beforeEach(() => {
        silenceConsoleErrors();
    });
    it('"Når ble samboerforholdet avsluttet?" skal ikke vises dersom man ikke har tidligere samboere', () => {
        spyOnUseApp(søknad);

        const { queryByText } = render(
            <TestProvidere>
                <DinLivssituasjon />
            </TestProvidere>
        );
        const result = queryByText(samboerSpråkIder.samboerTilDato);
        expect(result).not.toBeInTheDocument();
    });

    it('"Når ble samboerforholdet avsluttet?" skal vises dersom det er minst et element i tidligereSamboere-listen', () => {
        spyOnUseApp({
            ...søknad,
            søker: {
                ...søknad.søker,
                utvidet: {
                    ...søknad.søker.utvidet,
                    tidligereSamboere: [
                        {
                            navn: {
                                id: TidligereSamboerSpørsmålId.tidligereSamboerNavn,
                                svar: 'Donald Duck',
                            },
                            ident: {
                                id: TidligereSamboerSpørsmålId.tidligereSamboerFnr,
                                svar: '12345678910',
                            },
                            fødselsdato: {
                                id: TidligereSamboerSpørsmålId.tidligereSamboerFødselsdato,
                                svar: '2000-01-01',
                            },
                            samboerFraDato: {
                                id: TidligereSamboerSpørsmålId.tidligereSamboerFraDato,
                                svar: '2000-01-01',
                            },
                            samboerTilDato: {
                                id: TidligereSamboerSpørsmålId.tidligereSamboerTilDato,
                                svar: '2000-01-01',
                            },
                        },
                    ],
                },
            },
        });

        const { queryByText } = render(
            <TestProvidere>
                <DinLivssituasjon />
            </TestProvidere>
        );
        const result = queryByText(samboerSpråkIder.samboerTilDato);
        expect(result).toBeInTheDocument();
    });
});
