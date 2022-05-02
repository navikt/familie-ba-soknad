import React from 'react';

import { queryByText, render, within } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { act } from 'react-dom/test-utils';

import { ESivilstand, ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ISøknad } from '../../../typer/søknad';
import {
    mockEøs,
    mockHistory,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import DinLivssituasjon from './DinLivssituasjon';
import { DinLivssituasjonSpørsmålId, dinLivssituasjonSpørsmålSpråkId } from './spørsmål';

const søknad = mockDeep<ISøknad>({
    søknadstype: ESøknadstype.UTVIDET,
    barnInkludertISøknaden: [
        {
            ident: '1234',
        },
    ],
    søker: {
        sivilstand: { type: ESivilstand.UGIFT },
        nåværendeSamboer: null,
        harSamboerNå: {
            id: DinLivssituasjonSpørsmålId.harSamboerNå,
            svar: null,
        },
        utvidet: {
            spørsmål: {
                årsak: {
                    id: DinLivssituasjonSpørsmålId.årsak,
                    svar: '',
                },
            },
        },
    },
});

describe('DinLivssituasjon', () => {
    mockHistory(['/din-livssituasjon']);

    beforeEach(() => {
        silenceConsoleErrors();
        mockEøs();
        jest.useFakeTimers('modern');
    });

    it('Alle tekster finnes i språkfil', async () => {
        spyOnUseApp(søknad);

        render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        expect(console.error).toHaveBeenCalledTimes(0);

        await act(async () => {
            jest.advanceTimersByTime(500);
        });
    });

    it('rendrer DinLivssituasjon steg og inneholder sidetittel', async () => {
        spyOnUseApp(søknad);

        const { findByText } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        expect(await findByText('Livssituasjonen din')).toBeInTheDocument();
    });

    it('Stopper fra å gå videre hvis årsak ikke er valgt', async () => {
        spyOnUseApp(søknad);

        const { findByText, findByRole } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        const gåVidere = await findByText('Gå videre');
        act(() => gåVidere.click());
        const alerts: HTMLElement = await findByRole('alert');
        const result: HTMLElement | null = queryByText(
            alerts,
            'Du må velge årsak til at du søker om utvidet barnetrygd for å gå videre'
        );
        expect(result).not.toBeNull();
    });

    it('Viser ikke spørsmål om er du separert, enke eller skilt om sivilstand UGIFT', async () => {
        spyOnUseApp(søknad);

        const { queryByText } = render(
            <TestProvidere>
                <DinLivssituasjon />
            </TestProvidere>
        );

        const spørsmål = queryByText(
            dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.separertEnkeSkilt]
        );
        expect(spørsmål).not.toBeInTheDocument();
    });

    it('Viser spørsmål harSamboerNå', async () => {
        spyOnUseApp(søknad);

        const { findByText } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        const result = await findByText('Har du samboer nå?');
        expect(result).toBeDefined();
    });

    it('Viser feilmelding med spørsmål tittel når ikke utfylt', async () => {
        spyOnUseApp(søknad);

        const { findByText, findByRole } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        const gåVidere = await findByText('Gå videre');
        act(() => gåVidere.click());
        const alerts: HTMLElement = await findByRole('alert');
        const result: HTMLElement | null = queryByText(
            alerts,
            'Du må oppgi om du har samboer nå for å gå videre'
        );
        expect(result).not.toBeNull();
    });

    it('Viser riktige feilmeldinger ved ingen utfylte felt av nåværende samboer', async () => {
        spyOnUseApp(søknad);

        const { findByText, findByRole } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        const harSamboerNåSpmFieldset: HTMLElement = await findByRole('group', {
            name: /Har du samboer nå?/i,
        });
        const jaKnapp: HTMLElement = within(harSamboerNåSpmFieldset).getByText('Ja');
        act(() => jaKnapp.click());

        const gåVidereKnapp = await findByText('Gå videre');
        act(() => gåVidereKnapp.click());

        const feiloppsummering = await findByRole('alert');

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
    });

    it('Viser ikke spørsmål om er du separert, enke eller skilt om sivilstand annet enn GIFT', async () => {
        spyOnUseApp(søknad);

        const { queryByText } = render(
            <TestProvidere>
                <DinLivssituasjon />
            </TestProvidere>
        );

        const spørsmål = queryByText(
            dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.separertEnkeSkilt]
        );
        expect(spørsmål).not.toBeInTheDocument();
    });

    it('Viser spørsmål om er du separert, enke eller skilt om sivilstand GIFT', async () => {
        spyOnUseApp({
            ...søknad,
            søker: {
                ...søknad.søker,
                sivilstand: { type: ESivilstand.GIFT },
            },
        });

        const { findByText } = render(
            <TestProvidere>
                <DinLivssituasjon />
            </TestProvidere>
        );

        const spørsmål = await findByText(
            dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.separertEnkeSkilt]
        );
        expect(spørsmål).toBeInTheDocument();
    });
});
