import React from 'react';

import { render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { ESivilstand } from '../../../typer/person';
import { ESøknadstype, ISøknad } from '../../../typer/søknad';
import { silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import DinLivssituasjon from './DinLivssituasjon';
import { samboerSpråkIder, TidligereSamboerSpørsmålId } from './spørsmål';

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
                                svar: '',
                            },
                            ident: {
                                id: TidligereSamboerSpørsmålId.tidligereSamboerFnr,
                                svar: '',
                            },
                            fødselsdato: {
                                id: TidligereSamboerSpørsmålId.tidligereSamboerFødselsdato,
                                svar: '',
                            },
                            samboerFraDato: {
                                id: TidligereSamboerSpørsmålId.tidligereSamboerFraDato,
                                svar: '',
                            },
                            samboerTilDato: {
                                id: TidligereSamboerSpørsmålId.tidligereSamboerTilDato,
                                svar: '',
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
