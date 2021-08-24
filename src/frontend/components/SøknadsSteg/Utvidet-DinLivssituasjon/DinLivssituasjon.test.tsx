import React from 'react';

import { queryByText, render, within } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { act } from 'react-dom/test-utils';

import { AlternativtSvarForInput, ESivilstand } from '../../../typer/person';
import { ESøknadstype, ISøknad } from '../../../typer/søknad';
import {
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import DinLivssituasjon from './DinLivssituasjon';
import {
    DinLivssituasjonSpørsmålId,
    dinLivssituasjonSpørsmålSpråkId,
    SamboerSpørsmålId,
} from './spørsmål';
import { useDinLivssituasjon } from './useDinLivssituasjon';

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
        },
    },
});

jest.mock('nav-frontend-alertstriper', () => ({ children }) => (
    <div data-testid="alertstripe">{children}</div>
));

describe('DinLivssituasjon', () => {
    beforeEach(() => {
        silenceConsoleErrors();
    });

    it('rendrer DinLivssituasjon steg og inneholder sidetittel', () => {
        spyOnUseApp(søknad);

        const { getByText } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        expect(getByText('Livssituasjonen din')).toBeInTheDocument();
    });

    it('Stopper fra å gå videre hvis årsak ikke er valgt', () => {
        spyOnUseApp(søknad);

        const { getByText, getByRole } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        const gåVidere = getByText('GÅ VIDERE');
        act(() => gåVidere.click());
        const alerts: HTMLElement = getByRole('alert');
        const result: HTMLElement | null = queryByText(
            alerts,
            'Hvorfor søker du om utvidet barnetrygd?'
        );
        expect(result).not.toBeNull();
    });
    it('Viser ikke spørsmål om er du separert, enke eller skilt om sivilstand UGIFT', () => {
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

    it('Viser spørsmål harSamboerNå', () => {
        spyOnUseApp(søknad);

        const { getByText } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        const result = getByText('Har du samboer nå?');
        expect(result).toBeDefined();
    });

    it('Viser feilmelding med spørsmål tittel når ikke utfylt', () => {
        spyOnUseApp(søknad);

        const { getByText, getByRole } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        const gåVidere = getByText('GÅ VIDERE');
        act(() => gåVidere.click());
        const alerts: HTMLElement = getByRole('alert');
        const result: HTMLElement | null = queryByText(alerts, 'Har du samboer nå?');
        expect(result).not.toBeNull();
    });

    it('Viser riktige feilmeldinger ved ingen utfylte felt av nåværende samboer', () => {
        spyOnUseApp(søknad);

        const { getByText, getByRole } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        const harSamboerNåSpmFieldset: HTMLElement = getByRole('group', {
            name: /Har du samboer nå?/i,
        });
        const jaKnapp: HTMLElement = within(harSamboerNåSpmFieldset).getByText('Ja');
        act(() => jaKnapp.click());

        const gåVidereKnapp = getByText('GÅ VIDERE');
        act(() => gåVidereKnapp.click());

        const feiloppsummering = getByRole('alert');

        const navnFeilmelding = within(feiloppsummering).getByText('Samboerens navn');
        expect(navnFeilmelding).toBeInTheDocument();
        const fødselsnummerFeilmelding = within(feiloppsummering).getByText(
            'Fødselsnummer eller d-nummer'
        );
        expect(fødselsnummerFeilmelding).toBeInTheDocument();
        const forholdStartFeilmelding = within(feiloppsummering).getByText(
            'Når startet samboerforholdet?'
        );
        expect(forholdStartFeilmelding).toBeInTheDocument();
    });

    it('Viser ikke spørsmål om er du separert, enke eller skilt om sivilstand annet enn GIFT', () => {
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

    it('Viser spørsmål om er du separert, enke eller skilt om sivilstand GIFT', () => {
        spyOnUseApp({
            ...søknad,
            søker: {
                ...søknad.søker,
                sivilstand: { type: ESivilstand.GIFT },
            },
        });

        const { queryByText } = render(
            <TestProvidere>
                <DinLivssituasjon />
            </TestProvidere>
        );

        const spørsmål = queryByText(
            dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.separertEnkeSkilt]
        );
        expect(spørsmål).toBeInTheDocument();
    });
});
