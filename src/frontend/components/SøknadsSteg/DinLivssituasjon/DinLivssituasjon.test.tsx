import React from 'react';

import { render, within } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { act } from 'react-dom/test-utils';

import { ESvar } from '@navikt/familie-form-elements';

import { ESivilstand, ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ISøknad } from '../../../typer/søknad';
import {
    mockEøs,
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

//Feilmelding dukker både opp under spørsmålet og i feiloppsummeringen
const antallFeilmeldingerPerFeil = 2;

describe('DinLivssituasjon', () => {
    beforeEach(() => {
        silenceConsoleErrors();
        mockEøs();
        jest.useFakeTimers();
    });

    it('Alle tekster finnes i språkfil', async () => {
        spyOnUseApp(søknad);

        render(
            <TestProvidereMedEkteTekster mocketNettleserHistorikk={['/din-livssituasjon']}>
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

        const { findByTestId } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        expect(await findByTestId('steg-tittel')).toBeInTheDocument();
    });

    it('Stopper fra å gå videre hvis årsak ikke er valgt', async () => {
        spyOnUseApp(søknad);

        const { queryAllByText, getByText, findByTestId } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        const gåVidere = await findByTestId('neste-steg');
        act(() => gåVidere.click());

        const feiloppsummeringstittel = getByText(
            'Du må rette opp eller svare på følgende spørsmål for å gå videre'
        );
        expect(feiloppsummeringstittel).toBeInTheDocument();
        const feilmeldingÅrsak = queryAllByText(
            'Du må velge årsak til at du søker om utvidet barnetrygd for å gå videre'
        );
        expect(feilmeldingÅrsak).toHaveLength(antallFeilmeldingerPerFeil);
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

        const { findByTestId, getByText, getAllByText } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        const gåVidere = await findByTestId('neste-steg');
        act(() => gåVidere.click());
        const feiloppsummeringstittel = getByText(
            'Du må rette opp eller svare på følgende spørsmål for å gå videre'
        );
        expect(feiloppsummeringstittel).toBeInTheDocument();
        const feilmeldingSamboer = getAllByText('Du må oppgi om du har samboer nå for å gå videre');
        expect(feilmeldingSamboer).toHaveLength(antallFeilmeldingerPerFeil);
    });

    it('Viser riktige feilmeldinger ved ingen utfylte felt av nåværende samboer', async () => {
        spyOnUseApp(søknad);

        const { findByTestId, getAllByText, getByText } = render(
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

        const feiloppsummeringstittel = getByText(
            'Du må rette opp eller svare på følgende spørsmål for å gå videre'
        );
        expect(feiloppsummeringstittel).toBeInTheDocument();

        const feilmeldingSamboerNavn = getAllByText('Du må oppgi samboerens navn for å gå videre');
        expect(feilmeldingSamboerNavn).toHaveLength(antallFeilmeldingerPerFeil);

        const feilmeldingFnr = getAllByText(
            'Du må oppgi samboerens fødselsnummer eller d-nummer for å gå videre'
        );
        expect(feilmeldingFnr).toHaveLength(antallFeilmeldingerPerFeil);

        const feilmeldingForholdStart = getAllByText(
            'Du må oppgi når samboerforholdet startet for å gå videre'
        );
        expect(feilmeldingForholdStart).toHaveLength(antallFeilmeldingerPerFeil);
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
