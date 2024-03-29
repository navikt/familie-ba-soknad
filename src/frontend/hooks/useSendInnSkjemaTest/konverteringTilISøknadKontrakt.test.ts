import { renderHook } from '@testing-library/react';

import { ISøknadKontraktV8 } from '../../typer/kontrakt/v8';
import {
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../utils/testing';
import { erGyldigISøknadKontrakt } from '../../utils/typeguards';
import { useSendInnSkjema } from '../useSendInnSkjema';

import { testdata1 } from './test-data/testdata1';
import { testdata2 } from './test-data/testdata2';
import { testdata3 } from './test-data/testdata3';
import { testdata4 } from './test-data/testdata4';
import { testdata5 } from './test-data/testdata5';

describe('test konvertering fra ISøknad til ISøknadKontrakt', () => {
    beforeEach(() => {
        silenceConsoleErrors();
    });
    it('case 1', async () => {
        const { input: iSøknad, output: expectedISøknadKontrakt } = testdata1;
        spyOnUseApp(iSøknad);
        const { result } = renderHook(() => useSendInnSkjema(), {
            wrapper: TestProvidereMedEkteTekster,
        });

        const [_, formatert]: [boolean, ISøknadKontraktV8] = await result.current.sendInnSkjemaV8();
        expect(erGyldigISøknadKontrakt(formatert)).toBeTruthy();
        expect(JSON.stringify(formatert)).toEqual(JSON.stringify(expectedISøknadKontrakt));
    });
    it('case 2', async () => {
        const { input: iSøknad, output: expectedISøknadKontrakt } = testdata2;
        spyOnUseApp(iSøknad);
        const { result } = renderHook(() => useSendInnSkjema(), {
            wrapper: TestProvidereMedEkteTekster,
        });

        const [_, formatert]: [boolean, ISøknadKontraktV8] = await result.current.sendInnSkjemaV8();
        expect(erGyldigISøknadKontrakt(formatert)).toBeTruthy();
        expect(JSON.stringify(formatert)).toEqual(JSON.stringify(expectedISøknadKontrakt));
    });
    it('case 3', async () => {
        const { input: iSøknad, output: expectedISøknadKontrakt } = testdata3;
        spyOnUseApp(iSøknad);
        const { result } = renderHook(() => useSendInnSkjema(), {
            wrapper: TestProvidereMedEkteTekster,
        });

        const [_, formatert]: [boolean, ISøknadKontraktV8] = await result.current.sendInnSkjemaV8();
        expect(erGyldigISøknadKontrakt(formatert)).toBeTruthy();
        expect(JSON.stringify(formatert)).toEqual(JSON.stringify(expectedISøknadKontrakt));
    });
    it('case 4', async () => {
        const { input: iSøknad, output: expectedISøknadKontrakt } = testdata4;
        spyOnUseApp(iSøknad);
        const { result } = renderHook(() => useSendInnSkjema(), {
            wrapper: TestProvidereMedEkteTekster,
        });

        const [_, formatert]: [boolean, ISøknadKontraktV8] = await result.current.sendInnSkjemaV8();
        expect(erGyldigISøknadKontrakt(formatert)).toBeTruthy();
        expect(JSON.stringify(formatert)).toEqual(JSON.stringify(expectedISøknadKontrakt));
    });
    it('case 5', async () => {
        const { input: iSøknad, output: expectedISøknadKontrakt } = testdata5;
        spyOnUseApp(iSøknad);
        const { result } = renderHook(() => useSendInnSkjema(), {
            wrapper: TestProvidereMedEkteTekster,
        });

        const [_, formatert]: [boolean, ISøknadKontraktV8] = await result.current.sendInnSkjemaV8();
        expect(erGyldigISøknadKontrakt(formatert)).toBeTruthy();
        expect(JSON.stringify(formatert)).toEqual(JSON.stringify(expectedISøknadKontrakt));
    });
});
