import React from 'react';

import { render } from '@testing-library/react';
import { mockDeep } from 'vitest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';

import { ESivilstand, ESøknadstype } from '../../../../common/typer/kontrakt/generelle';
import { ISøknad } from '../../../typer/søknad';
import { spyOnUseApp, TestProvidere } from '../../../utils/testing';

import DinLivssituasjon from './DinLivssituasjon';
import { DinLivssituasjonSpørsmålId, TidligereSamboerSpørsmålId } from './spørsmål';

const søknad = mockDeep<ISøknad>({
    søknadstype: ESøknadstype.UTVIDET,
    barnInkludertISøknaden: [
        {
            ident: '1234',
        },
    ],
    søker: {
        sivilstand: { type: ESivilstand.SKILT },

        utvidet: {
            spørsmål: {
                årsak: { svar: '' },
                harSamboerNå: {
                    id: DinLivssituasjonSpørsmålId.harSamboerNå,
                    svar: ESvar.JA,
                },
            },
            tidligereSamboere: [],
            nåværendeSamboer: {
                navn: { svar: '' },
                ident: { svar: '' },
                fødselsdato: { svar: '' },
                samboerFraDato: { svar: '' },
            },
        },
    },
});

describe('TidligereSamboere', () => {
    it('"Når ble samboerforholdet avsluttet?" skal ikke vises dersom man ikke har tidligere samboere', () => {
        spyOnUseApp(søknad);

        const { queryByTestId } = render(
            <TestProvidere mocketNettleserHistorikk={['/din-livssituasjon']}>
                <DinLivssituasjon />
            </TestProvidere>
        );
        const result = queryByTestId('utvidet-tidligere-samboer-samboerTilDato');
        expect(result).not.toBeInTheDocument();
    });

    it('"Når ble samboerforholdet avsluttet?" skal vises dersom det er minst et element i tidligereSamboere-listen', () => {
        spyOnUseApp({
            ...søknad,
            søker: {
                ...søknad.søker,
                utvidet: {
                    ...søknad.søker.utvidet,
                    spørsmål: {
                        ...søknad.søker.utvidet.spørsmål,
                        hattAnnenSamboerForSøktPeriode: {
                            id: DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode,
                            svar: ESvar.JA,
                        },
                    },
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

        const { getByTestId } = render(
            <TestProvidere>
                <DinLivssituasjon />
            </TestProvidere>
        );
        const result = getByTestId('utvidet-tidligere-samboer-samboerTilDato');
        expect(result).toBeInTheDocument();
    });
});
