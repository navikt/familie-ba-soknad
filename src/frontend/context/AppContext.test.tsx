import React from 'react';

import { act, renderHook, RenderHookResult } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import JestMockPromise from 'jest-mock-promise';

import { ESvar } from '@navikt/familie-form-elements';

import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { ESivilstand, ESøknadstype } from '../typer/kontrakt/generelle';
import { ISøkerRespons } from '../typer/person';
import { initialStateSøknad, ISøknad } from '../typer/søknad';
import {
    mockEøs,
    mockFeatureToggle,
    mockRoutes,
    mockSanity,
    silenceConsoleErrors,
    TestProvidere,
} from '../utils/testing';

import { useApp } from './AppContext';

const initialSøknad = initialStateSøknad(false);

const søknadEtterRespons: ISøknad = {
    ...initialSøknad,
    søknadstype: ESøknadstype.ORDINÆR,
    søker: {
        ...initialSøknad.søker,
        ident: '12345678910',
        navn: 'Navn navnesen',
        barn: [],
        statsborgerskap: [{ landkode: 'DZA' }],
        adresse: { adressenavn: 'Heiveien 32' },
        sivilstand: { type: ESivilstand.UGIFT },
    },
};

jest.mock('./InnloggetContext', () => {
    return {
        __esModule: true,
        useInnloggetContext: () => ({
            innloggetStatus: 0 /* InnloggetStatus.AUTENTISERT = 0 men kan ikke brukes inni her */,
        }),
        InnloggetProvider: ({ children }) => <>{children}</>,
    };
});

// Synkront promise, når det resolver kjører et par setStates som ellers ville spammet jest-warnings
const mockResult = new JestMockPromise();
jest.mock('./LastRessurserContext', () => {
    return {
        __esModule: true,
        useLastRessurserContext: () => ({
            axiosRequest: () => mockResult,
            lasterRessurser: () => false,
        }),
        LastRessurserProvider: ({ children }) => <>{children}</>,
    };
});

const mockSluttbrukerResult = new JestMockPromise();
jest.mock('../context/pdl', () => {
    return {
        __esModule: true,
        hentSluttbrukerFraPdl: () => mockSluttbrukerResult,
    };
});

describe('AppContext', () => {
    let hookResult: RenderHookResult<ReturnType<typeof useApp>, unknown>;

    const resolveAxiosRequestTilSøkerRessurs = async () =>
        mockResult.resolve({ status: 'SUKSESS', data: mockDeep<ISøkerRespons>() });

    const resolvePdlRequestTilSøkerRessurs = async () =>
        mockSluttbrukerResult.resolve({
            status: 'SUKSESS',
            data: mockDeep({
                sivilstand: { type: 'UGIFT' },
            }),
        });

    beforeEach(() => {
        mockEøs();
        mockRoutes();
        mockFeatureToggle();
        mockSanity();
        silenceConsoleErrors();
        hookResult = renderHook(() => useApp(), {
            wrapper: TestProvidere,
        });
    });

    describe('erStegUtfyltFraFør', () => {
        test('Skal returnere true dersom siste utfylte steg er det samme som nåværende steg', async () => {
            const nåværendeStegIndex = 2;
            const { settSisteUtfylteStegIndex } = hookResult.result.current;
            act(() => settSisteUtfylteStegIndex(2));
            expect(hookResult.result.current.erStegUtfyltFrafør(nåværendeStegIndex)).toEqual(true);
            await act(resolveAxiosRequestTilSøkerRessurs);
            await act(resolvePdlRequestTilSøkerRessurs);
        });

        test('Skal returnere true dersom siste utfylte steg er etter nåværende steg', async () => {
            const nåværendeStegIndex = 2;
            const { settSisteUtfylteStegIndex } = hookResult.result.current;
            act(() => settSisteUtfylteStegIndex(3));
            expect(hookResult.result.current.erStegUtfyltFrafør(nåværendeStegIndex)).toEqual(true);
            await act(resolveAxiosRequestTilSøkerRessurs);
            await act(resolvePdlRequestTilSøkerRessurs);
        });

        test('Skal returnere false dersom siste utfylte steg er før nåværende steg', async () => {
            const nåværendeStegIndex = 2;
            const { settSisteUtfylteStegIndex } = hookResult.result.current;
            act(() => settSisteUtfylteStegIndex(1));
            expect(hookResult.result.current.erStegUtfyltFrafør(nåværendeStegIndex)).toEqual(false);
            await act(resolveAxiosRequestTilSøkerRessurs);
            await act(resolvePdlRequestTilSøkerRessurs);
        });
    });

    describe('nullstillSøknadsObject', () => {
        test('Skal nullstille søknadsobjekt bortsett fra person hentet fra backend og søknadstype', async () => {
            const søknadHalvveisUtfylt: ISøknad = {
                ...søknadEtterRespons,
                erNoenAvBarnaFosterbarn: {
                    id: OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn,
                    svar: ESvar.JA,
                },
                oppholderBarnSegIInstitusjon: {
                    id: OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon,
                    svar: ESvar.JA,
                },
                erBarnAdoptertFraUtland: {
                    id: OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland,
                    svar: ESvar.JA,
                },
            };

            act(() => hookResult.result.current.settSøknad(søknadHalvveisUtfylt));
            expect(hookResult.result.current.søknad).toEqual(søknadHalvveisUtfylt);
            act(() => hookResult.result.current.nullstillSøknadsobjekt());
            expect(hookResult.result.current.søknad).toEqual(søknadEtterRespons);
            await act(resolveAxiosRequestTilSøkerRessurs);
            await act(resolvePdlRequestTilSøkerRessurs);
        });
    });

    describe('avbrytOgSlettSøknad', () => {
        test('Ved avbryt skal sisteUtfylteStegIndex settes til -1', async () => {
            hookResult.result.current.sisteUtfylteStegIndex = 3;
            act(() => hookResult.result.current.avbrytOgSlettSøknad());
            expect(hookResult.result.current.sisteUtfylteStegIndex).toEqual(-1);
            await act(resolveAxiosRequestTilSøkerRessurs);
            await act(resolvePdlRequestTilSøkerRessurs);
        });
    });
});
