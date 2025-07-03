import React from 'react';
import { act } from 'react';

import { render, within } from '@testing-library/react';
import { mockDeep } from 'vitest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';

import { ESivilstand, ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ISøknad } from '../../../typer/søknad';
import {
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
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
        sivilstand: { type: ESivilstand.UGIFT },
        utvidet: {
            spørsmål: {
                årsak: {
                    id: DinLivssituasjonSpørsmålId.årsak,
                    svar: '',
                },
                harSamboerNå: {
                    id: DinLivssituasjonSpørsmålId.harSamboerNå,
                    svar: null,
                },
            },
            nåværendeSamboer: null,
            tidligereSamboere: [],
        },
    },
});

describe('DinLivssituasjon', () => {
    beforeEach(() => {
        silenceConsoleErrors();
    });

    it('rendrer DinLivssituasjon steg og inneholder sidetittel', async () => {
        spyOnUseApp(søknad);

        const { findByTestId } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        expect(await findByTestId('steg-tittel')).toBeInTheDocument();
    });

    it('Stopper fra å gå videre hvis årsak ikke er valgt', async () => {
        spyOnUseApp(søknad);

        const { findByTestId, getByTestId } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        const gåVidere = await findByTestId('neste-steg');
        act(() => gåVidere.click());

        const feiloppsummering = getByTestId('skjema-feiloppsummering');
        expect(feiloppsummering).toBeInTheDocument();

        const feilmeldingÅrsak = getByTestId('feilmelding-årsak');
        expect(feilmeldingÅrsak).toBeInTheDocument();
    });

    it('Viser ikke spørsmål om er du separert, enke eller skilt om sivilstand UGIFT', async () => {
        spyOnUseApp(søknad);

        const { queryByTestId } = render(
            <TestProvidere>
                <DinLivssituasjon />
            </TestProvidere>
        );

        const spørsmål = queryByTestId(DinLivssituasjonSpørsmålId.separertEnkeSkilt);
        expect(spørsmål).not.toBeInTheDocument();
    });

    it('Viser spørsmål harSamboerNå', async () => {
        spyOnUseApp(søknad);

        const { findByTestId } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        expect(await findByTestId('har-samboer-nå')).toBeDefined();
    });

    it('Viser feilmelding med spørsmål tittel når ikke utfylt', async () => {
        spyOnUseApp(søknad);

        const { findByTestId, getByTestId } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        const gåVidere = await findByTestId('neste-steg');
        act(() => gåVidere.click());

        const feiloppsummering = getByTestId('skjema-feiloppsummering');
        expect(feiloppsummering).toBeInTheDocument();

        const feilmeldingSamboer = getByTestId('feilmelding-har-samboer-nå');
        expect(feilmeldingSamboer).toBeInTheDocument();
    });

    it('Viser riktige feilmeldinger ved ingen utfylte felt av nåværende samboer', async () => {
        spyOnUseApp(søknad);

        const { findByTestId, getByTestId } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );

        const harSamboerNåSpmFieldset: HTMLElement = await findByTestId(
            DinLivssituasjonSpørsmålId.harSamboerNå
        );
        const jaKnapp: HTMLElement | undefined = within(harSamboerNåSpmFieldset)
            .getAllByRole('radio')
            .find(radio => radio.getAttribute('value') === ESvar.JA);
        expect(jaKnapp).toBeDefined();
        act(() => jaKnapp!.click());

        const gåVidereKnapp = await findByTestId('neste-steg');
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
    });

    it('Viser ikke spørsmål om er du separert, enke eller skilt om sivilstand annet enn GIFT', async () => {
        spyOnUseApp(søknad);

        const { queryByTestId } = render(
            <TestProvidere>
                <DinLivssituasjon />
            </TestProvidere>
        );

        const spørsmål = await queryByTestId(DinLivssituasjonSpørsmålId.separertEnkeSkilt);
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

        const { findByTestId } = render(
            <TestProvidere>
                <DinLivssituasjon />
            </TestProvidere>
        );

        const spørsmål = await findByTestId(DinLivssituasjonSpørsmålId.harSamboerNå);
        expect(spørsmål).toBeInTheDocument();
    });
});
