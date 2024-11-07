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
                harSamboerNå: { id: DinLivssituasjonSpørsmålId.harSamboerNå, svar: null },
            },
            nåværendeSamboer: null,
            tidligereSamboere: [],
        },
    },
});

//Feilmelding dukker både opp under spørsmålet og i feiloppsummeringen
const antallFeilmeldingerPerFeil = 2;

describe('LeggTilSamboerModal', () => {
    beforeEach(() => {
        silenceConsoleErrors();
    });
    it('Viser riktige feilmeldinger ved ingen utfylte felt av tidligere samboer', async () => {
        spyOnUseApp(søknad);

        const { getByText, getAllByText, findByRole, getByTestId } = render(
            <TestProvidereMedEkteTekster mocketNettleserHistorikk={['/din-livssituasjon']}>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );

        const hattAnnenSamboerForSøktPeriode: HTMLElement = await findByRole('group', {
            name: /Har du hatt samboer tidligere i perioden du søker barnetrygd for?/i,
        });

        const jaKnapp: HTMLElement = within(hattAnnenSamboerForSøktPeriode).getByText('Ja');
        act(() => jaKnapp.click());

        const leggTilSamboerKnapp: HTMLElement = getByText('Legg til samboer');
        act(() => leggTilSamboerKnapp.click());

        const gåVidereKnapp = getAllByText('Legg til samboer');
        act(() => gåVidereKnapp[2].click());

        const feiloppsummering = getByTestId('skjema-feiloppsummering');
        expect(feiloppsummering).toBeInTheDocument();

        const navnFeilmelding = getAllByText('Du må oppgi samboerens navn for å gå videre');
        expect(navnFeilmelding).toHaveLength(antallFeilmeldingerPerFeil);

        const fødselsnummerFeilmelding = getAllByText(
            'Du må oppgi samboerens fødselsnummer eller d-nummer for å gå videre'
        );
        expect(fødselsnummerFeilmelding).toHaveLength(antallFeilmeldingerPerFeil);

        const forholdStartFeilmelding = getAllByText(
            'Du må oppgi når samboerforholdet startet for å gå videre'
        );
        expect(forholdStartFeilmelding).toHaveLength(antallFeilmeldingerPerFeil);

        const forholdSluttFeilmelding = getAllByText(
            'Du må oppgi når samboerforholdet ble avsluttet for å gå videre'
        );
        expect(forholdSluttFeilmelding).toHaveLength(antallFeilmeldingerPerFeil);
    });
});
