import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { ESivilstand } from '../../typer/kontrakt/generelle';
import { ISøknadKontrakt } from '../../typer/kontrakt/kontrakt';
import { hentSivilstatusSpråkId } from '../../utils/språk';
import {
    mekkGyldigUtvidetSøknad,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../utils/testing';
import { erGyldigISøknadKontrakt } from '../../utils/typeguards';
import { useSendInnSkjema } from '../useSendInnSkjema';

silenceConsoleErrors();

describe('useSendInnSkjema', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    it('mapper til gyldig utvidet kontrakt', async () => {
        const iSøknad = mekkGyldigUtvidetSøknad();
        spyOnUseApp(iSøknad);
        const { result } = renderHook(() => useSendInnSkjema(), {
            wrapper: TestProvidereMedEkteTekster,
        });
        const [_, formatert]: [boolean, ISøknadKontrakt] = await result.current.sendInnSkjema();
        expect(erGyldigISøknadKontrakt(formatert)).toBeTruthy();
        await act(async () => {
            jest.advanceTimersByTime(500);
        });
    });

    it('Kan mappe sivilstandenum til språktekster', () => {
        const språktekster = Object.values(ESivilstand).map(hentSivilstatusSpråkId);
        let sivilstandCount = 0;
        for (const sivilstand in ESivilstand) {
            expect(språktekster).toContain(`felles.sivilstatus.kode.${sivilstand}`);
            sivilstandCount++;
        }
        expect(språktekster.length).toEqual(sivilstandCount);
    });
});
