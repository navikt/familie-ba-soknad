import React from 'react';

import { queryByText, render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { act } from 'react-dom/test-utils';

import { ESivilstand } from '../../../typer/person';
import { ESøknadstype, ISøknad } from '../../../typer/søknad';
import {
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import DinLivssituasjon from './DinLivssituasjon';
import { DinLivssituasjonSpørsmålId, dinLivssituasjonSpørsmålSpråkId } from './spørsmål';

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
    });
    describe('Søknadsobjekt med søkers sivilstand annet enn GIFT', () => {
        beforeEach(() => {
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
        it('Viser ikke spørsmål om er du separert, enke eller skilt om sivilstand UGIFT', () => {
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
    });

    it('Viser spørsmål om er du separert, enke eller skilt om sivilstand GIFT', () => {
        const søknad = mockDeep<ISøknad>({
            søknadstype: ESøknadstype.UTVIDET,
            barnInkludertISøknaden: [
                {
                    ident: '1234',
                },
            ],
            søker: {
                sivilstand: { type: ESivilstand.GIFT },
            },
        });
        spyOnUseApp(søknad);
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
