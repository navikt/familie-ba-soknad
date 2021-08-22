import React from 'react';

import { queryByText, render, within } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { act } from 'react-dom/test-utils';

import { ESøknadstype, ISøknad } from '../../../typer/søknad';
import {
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import DinLivssituasjon from './DinLivssituasjon';
import { DinLivssituasjonSpørsmålId } from './spørsmål';

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

jest.mock('nav-frontend-alertstriper', () => ({ children }) => (
    <div data-testid="alertstripe">{children}</div>
));

describe('DinLivssituasjon', () => {
    beforeEach(() => {
        silenceConsoleErrors();
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
        spyOnUseApp(søknad);
    });

    it('rendrer DinLivssituasjon steg og inneholder sidetittel', () => {
        const { getByText } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        expect(getByText('Din livssituasjon')).toBeInTheDocument();
    });

    it('Stopper fra å gå videre hvis årsak ikke er valgt', () => {
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

    it('Viser spørsmål harSamboerNå', () => {
        const { getByText } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        const result = getByText('Har du samboer nå?');
        expect(result).toBeDefined();
    });
    it('Viser feilmelding med spørsmål tittel når ikke utfylt', () => {
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
            'Du må oppgi fødselsnummeret til samboeren din (TODO)'
        );
        expect(fødselsnummerFeilmelding).toBeInTheDocument();
        const forholdStartFeilmelding = within(feiloppsummering).getByText(
            'Når startet samboerforholdet?'
        );
        expect(forholdStartFeilmelding).toBeInTheDocument();
    });
});
