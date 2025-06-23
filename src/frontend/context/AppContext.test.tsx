import React from 'react';

import { act, renderHook, type RenderHookResult } from '@testing-library/react';
import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';
import { type Ressurs } from '@navikt/familie-typer';

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

import { useAppContext } from './AppContext';
import * as PDLLasting from './pdl';

const initialSøknad = initialStateSøknad();

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

vi.mock('./InnloggetContext', () => {
    return {
        __esModule: true,
        useInnloggetContext: () => ({
            innloggetStatus: 0 /* InnloggetStatus.AUTENTISERT = 0 men kan ikke brukes inni her */,
        }),
        InnloggetProvider: ({ children }) => <>{children}</>,
    };
});

let mockLastRessursResolve;
const mockLastRessursPromise = new Promise(resolve => {
    mockLastRessursResolve = resolve;
});
vi.mock('./LastRessurserContext.tsx', () => {
    return {
        __esModule: true,
        useLastRessurserContext: () => ({
            axiosRequest: () => mockLastRessursPromise,
            lasterRessurser: () => false,
            ressurserSomLaster: [],
            settRessurserSomLaster: vi.fn(),
            fjernRessursSomLaster: vi.fn(),
        }),
        LastRessurserProvider: ({ children }) => <>{children}</>,
    };
});

let mockSluttbrukerResolve;
const mockSluttbrukerPromise = new Promise(resolve => {
    mockSluttbrukerResolve = resolve;
});

vi.spyOn(PDLLasting, 'hentSluttbrukerFraPdl').mockImplementation(
    () => mockSluttbrukerPromise as Promise<Ressurs<ISøkerRespons>>
);

describe('AppContext', () => {
    let hookResult: RenderHookResult<ReturnType<typeof useAppContext>, unknown>;

    const resolveAxiosRequestTilSøkerRessurs = async () =>
        mockLastRessursResolve({ status: 'SUKSESS', data: mockDeep<ISøkerRespons>() });

    const resolvePdlRequestTilSøkerRessurs = async () =>
        mockSluttbrukerResolve({
            status: 'SUKSESS',
            data: mockDeep({
                sivilstand: { type: 'UGIFT' },
            }),
        });

    beforeEach(() => {
        mockEøs();
        mockRoutes();
        mockSanity();
        mockFeatureToggle();
        silenceConsoleErrors();
        hookResult = renderHook(() => useAppContext(), {
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
