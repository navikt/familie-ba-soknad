import React from 'react';

import { render, within } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { act } from 'react-dom/test-utils';

import { ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ISøknad } from '../../../typer/søknad';
import {
    mockHistory,
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
        nåværendeSamboer: null,
        harSamboerNå: { id: DinLivssituasjonSpørsmålId.harSamboerNå, svar: null },
    },
});

describe('LeggTilSamboerModal', () => {
    mockHistory(['/din-livssituasjon']);

    beforeEach(() => {
        silenceConsoleErrors();
    });
    it('Viser riktige feilmeldinger ved ingen utfylte felt av tidligere samboer', () => {
        spyOnUseApp(søknad);

        const { getByText, getByRole, getAllByText } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );

        const leggTilSamboerKnapp: HTMLElement = getByText('Legg til samboer');
        act(() => leggTilSamboerKnapp.click());

        const gåVidereKnapp = getAllByText('Legg til samboer');
        act(() => gåVidereKnapp[2].click());

        const feiloppsummering = getByRole('alert');

        const navnFeilmelding = within(feiloppsummering).getByText(
            'Du må oppgi samboerens navn for å gå videre'
        );
        expect(navnFeilmelding).toBeInTheDocument();
        const fødselsnummerFeilmelding = within(feiloppsummering).getByText(
            'Du må oppgi samboerens fødselsnummer eller d-nummer for å gå videre'
        );
        expect(fødselsnummerFeilmelding).toBeInTheDocument();
        const forholdStartFeilmelding = within(feiloppsummering).getByText(
            'Du må oppgi når samboerforholdet startet for å gå videre'
        );
        expect(forholdStartFeilmelding).toBeInTheDocument();
        const forholdSluttFeilmelding = within(feiloppsummering).getByText(
            'Du må oppgi når samboerforholdet ble avsluttet for å gå videre'
        );
        expect(forholdSluttFeilmelding).toBeInTheDocument();
    });
});
