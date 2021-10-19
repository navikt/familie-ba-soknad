import React from 'react';

import { act } from '@testing-library/react';
import { renderHook, RenderResult } from '@testing-library/react-hooks';
import { mockDeep } from 'jest-mock-extended';
import JestMockPromise from 'jest-mock-promise';

import { ESvar } from '@navikt/familie-form-elements';

import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { ESivilstand, ISøkerRespons } from '../typer/person';
import { ESøknadstype, initialStateSøknad, ISøknad } from '../typer/søknad';
import { TestProvidere } from '../utils/testing';
import { useApp } from './AppContext';

const søknadEtterRespons: ISøknad = {
    ...initialStateSøknad,
    søknadstype: ESøknadstype.ORDINÆR,
    søker: {
        ...initialStateSøknad.søker,
        ident: '12345678910',
        navn: 'Navn navnesen',
        barn: [],
        statsborgerskap: [{ landkode: 'DZA' }],
        adresse: { adressenavn: 'Heiveien 32' },
        sivilstand: { type: ESivilstand.GIFT },
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

jest.mock('./EøsContext', () => {
    return {
        __esModule: true,
        useEøsContext: () => ({
            eøsSkruddAv: true,
            erEøsLand: jest.fn(),
        }),
        EøsProvider: ({ children }) => <>{children}</>,
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

describe('AppContext', () => {
    let hookResult: RenderResult<ReturnType<typeof useApp>>;
    const resolveAxiosRequestTilSøkerRessurs = async () =>
        mockResult.resolve({ status: 'SUKSESS', data: mockDeep<ISøkerRespons>() });

    beforeEach(() => {
        const { result } = renderHook(() => useApp(), {
            wrapper: TestProvidere,
        });
        hookResult = result;
    });

    describe('erStegUtfyltFraFør', () => {
        test('Skal returnere true dersom siste utfylte steg er det samme som nåværende steg', async () => {
            const nåværendeStegIndex = 2;
            const { settSisteUtfylteStegIndex } = hookResult.current;
            act(() => settSisteUtfylteStegIndex(2));
            expect(hookResult.current.erStegUtfyltFrafør(nåværendeStegIndex)).toEqual(true);
            await act(resolveAxiosRequestTilSøkerRessurs);
        });

        test('Skal returnere true dersom siste utfylte steg er etter nåværende steg', async () => {
            const nåværendeStegIndex = 2;
            const { settSisteUtfylteStegIndex } = hookResult.current;
            act(() => settSisteUtfylteStegIndex(3));
            expect(hookResult.current.erStegUtfyltFrafør(nåværendeStegIndex)).toEqual(true);
            await act(resolveAxiosRequestTilSøkerRessurs);
        });

        test('Skal returnere false dersom siste utfylte steg er før nåværende steg', async () => {
            const nåværendeStegIndex = 2;
            const { settSisteUtfylteStegIndex } = hookResult.current;
            act(() => settSisteUtfylteStegIndex(1));
            expect(hookResult.current.erStegUtfyltFrafør(nåværendeStegIndex)).toEqual(false);
            await act(resolveAxiosRequestTilSøkerRessurs);
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
                oppholderBarnSegIUtland: {
                    id: OmBarnaDineSpørsmålId.oppholderBarnSegIUtland,
                    svar: ESvar.JA,
                },
            };

            act(() => hookResult.current.settSøknad(søknadHalvveisUtfylt));
            expect(hookResult.current.søknad).toEqual(søknadHalvveisUtfylt);
            act(() => hookResult.current.nullstillSøknadsobjekt());
            expect(hookResult.current.søknad).toEqual(søknadEtterRespons);
            await act(resolveAxiosRequestTilSøkerRessurs);
        });
    });

    describe('avbrytOgSlettSøknad', () => {
        test('Ved avbryt skal sisteUtfylteStegIndex settes til -1', async () => {
            hookResult.current.sisteUtfylteStegIndex = 3;
            act(() => hookResult.current.avbrytOgSlettSøknad());
            expect(hookResult.current.sisteUtfylteStegIndex).toEqual(-1);
            await act(resolveAxiosRequestTilSøkerRessurs);
        });
    });
});
