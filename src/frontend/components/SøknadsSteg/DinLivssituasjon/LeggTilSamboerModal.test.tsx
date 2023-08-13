import React from 'react';

import { render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

import { ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ISøknad } from '../../../typer/søknad';
import {
    silenceConsoleErrors,
    spyOnModal,
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
        nåværendeSamboer: null,
        harSamboerNå: { id: DinLivssituasjonSpørsmålId.harSamboerNå, svar: null },
    },
});

//Feilmelding dukker både opp under spørsmålet og i feiloppsummeringen
const antallFeilmeldingerPerFeil = 2;

describe('LeggTilSamboerModal', () => {
    beforeEach(() => {
        silenceConsoleErrors();
        spyOnModal();
    });
    it('Viser riktige feilmeldinger ved ingen utfylte felt av tidligere samboer', () => {
        spyOnUseApp(søknad);

        const { getByText, getAllByText, queryByText } = render(
            <TestProvidereMedEkteTekster>
                <MemoryRouter initialEntries={['/din-livssituasjon']}>
                    <DinLivssituasjon />
                </MemoryRouter>
            </TestProvidereMedEkteTekster>
        );

        const leggTilSamboerKnapp: HTMLElement = getByText('Legg til samboer');
        act(() => leggTilSamboerKnapp.click());

        const gåVidereKnapp = getAllByText('Legg til samboer');
        act(() => gåVidereKnapp[2].click());

        const feiloppsummeringstittel = queryByText(
            'Du må rette opp eller svare på følgende spørsmål for å gå videre'
        );
        expect(feiloppsummeringstittel).toBeInTheDocument();
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
