import { renderHook } from '@testing-library/react-hooks';

import { ESivilstand } from '../typer/person';
import { ISøknadKontrakt } from '../typer/søknad';
import { hentSivilstatusSpråkId } from '../utils/språk';
import {
    mekkGyldigUtvidetSøknad,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../utils/testing';
import { erGyldigISøknadKontraktUtvidet } from '../utils/typeguards';
import { useSendInnSkjema } from './useSendInnSkjema';

describe('useSendInnSkjema', () => {
    it('mapper til gyldig utvidet kontrakt', async () => {
        const iSøknad = mekkGyldigUtvidetSøknad();
        spyOnUseApp(iSøknad);
        const { result } = renderHook(() => useSendInnSkjema(), {
            wrapper: TestProvidereMedEkteTekster,
        });
        const [_, formatert]: [boolean, ISøknadKontrakt] = await result.current.sendInnSkjema();
        expect(erGyldigISøknadKontraktUtvidet(formatert)).toBeTruthy();
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
