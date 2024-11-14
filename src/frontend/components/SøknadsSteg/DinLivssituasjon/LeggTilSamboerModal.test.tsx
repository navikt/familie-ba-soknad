import React from 'react';

import { render, within } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { act } from 'react-dom/test-utils';

import { ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ISøknad } from '../../../typer/søknad';
import {
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';

import DinLivssituasjon from './DinLivssituasjon';
import { DinLivssituasjonSpørsmålId } from './spørsmål';

const søknad = mockDeep<ISøknad>({
    søknadstype: ESøknadstype.UTVIDET,
    barnInkludertISøknaden: [
        {
            ident: '1234',
        },
    ],
    søker: {
        utvidet: {
            spørsmål: {
                harSamboerNå: {
                    id: DinLivssituasjonSpørsmålId.harSamboerNå,
                    svar: null,
                },
                hattAnnenSamboerForSøktPeriode: {
                    id: DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode,
                    svar: null,
                },
            },
            nåværendeSamboer: null,
            tidligereSamboere: [],
        },
    },
});

describe('LeggTilSamboerModal', () => {
    beforeEach(() => {
        silenceConsoleErrors();
    });
    it('Viser riktige feilmeldinger ved ingen utfylte felt av tidligere samboer', async () => {
        spyOnUseApp(søknad);

        const { getByText, getByTestId, findByTestId } = render(
            <TestProvidereMedEkteTekster mocketNettleserHistorikk={['/din-livssituasjon']}>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );

        const hattAnnenSamboerSpørsmål = await findByTestId('hatt-annen-samboer-i-perioden');

        const jaKnapp: HTMLElement = within(hattAnnenSamboerSpørsmål).getAllByRole('radio')[0];
        act(() => jaKnapp.click());

        const leggTilSamboerKnapp: HTMLElement = getByText('Legg til samboer');
        act(() => leggTilSamboerKnapp.click());

        const gåVidereKnapp = getByTestId('neste-steg');
        act(() => gåVidereKnapp.click());

        const feiloppsummering = getByTestId('skjema-feiloppsummering');
        expect(feiloppsummering).toBeInTheDocument();

        const feilmeldingSamboerNavn = getByTestId('feilmelding-utvidet-nåværende-samboer-navn');
        expect(feilmeldingSamboerNavn).toBeInTheDocument();

        const feilmeldingFnr = getByTestId('feilmelding-utvidet-nåværende-samboer-fnr');
        expect(feilmeldingFnr).toBeInTheDocument();

        const feilmeldingForholdStart = getByTestId(
            'feilmelding-utvidet-nåværende-samboer-samboerFraDato'
        );
        expect(feilmeldingForholdStart).toBeInTheDocument();

        const feilmeldingForholdSlutt = getByTestId(
            'feilmelding-utvidet-nåværende-samboer-samboerTilDato'
        );
        expect(feilmeldingForholdSlutt).toBeInTheDocument();
    });
});
