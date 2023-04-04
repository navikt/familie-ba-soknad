import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';

import { ESivilstand } from '../../typer/kontrakt/generelle';
import { ISøknadKontraktV8 } from '../../typer/kontrakt/v8';
import { hentSivilstatusSpråkId } from '../../utils/språk';
import {
    mekkGyldigUtvidetSøknad,
    silenceConsoleErrors,
    spyOnModal,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../utils/testing';
import { erGyldigISøknadKontrakt } from '../../utils/typeguards';
import { useSendInnSkjema } from '../useSendInnSkjema';

silenceConsoleErrors();

describe('useSendInnSkjema', () => {
    beforeEach(() => {
        jest.useFakeTimers('modern');
        spyOnModal();
    });

    it('mapper til gyldig utvidet kontrakt', async () => {
        const iSøknad = mekkGyldigUtvidetSøknad();
        spyOnUseApp(iSøknad);
        const { result } = renderHook(() => useSendInnSkjema(), {
            wrapper: TestProvidereMedEkteTekster,
        });
        const [_, formatert]: [boolean, ISøknadKontraktV8] = await result.current.sendInnSkjemaV8();
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
