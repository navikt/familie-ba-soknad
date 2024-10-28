import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { ESivilstand } from '../../typer/kontrakt/generelle';
import { ISøknadKontrakt } from '../../typer/kontrakt/kontrakt';
import { ESanitySivilstandApiKey } from '../../typer/sanity/sanity';
import { hentSivilstatusSpråkId, sivilstandTilSanitySivilstandApiKey } from '../../utils/språk';
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

    it('Kan mappe sivilstandenum til sanity sivilstand', () => {
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.GIFT)).toEqual(
            ESanitySivilstandApiKey.GIFT
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.UGIFT)).toEqual(
            ESanitySivilstandApiKey.UGIFT
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.ENKE_ELLER_ENKEMANN)).toEqual(
            ESanitySivilstandApiKey.ENKE_ELLER_ENKEMANN
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.SKILT)).toEqual(
            ESanitySivilstandApiKey.SKILT
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.SEPARERT)).toEqual(
            ESanitySivilstandApiKey.SEPARERT
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.REGISTRERT_PARTNER)).toEqual(
            ESanitySivilstandApiKey.REGISTRERT_PARTNER
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.SEPARERT_PARTNER)).toEqual(
            ESanitySivilstandApiKey.SEPARERT_PARTNER
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.SKILT_PARTNER)).toEqual(
            ESanitySivilstandApiKey.SKILT_PARTNER
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.GJENLEVENDE_PARTNER)).toEqual(
            ESanitySivilstandApiKey.GJENLEVENDE_PARTNER
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.UOPPGITT)).toEqual(
            ESanitySivilstandApiKey.UOPPGITT
        );
    });
});
