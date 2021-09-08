import { renderHook } from '@testing-library/react-hooks';

import { ISøknadKontrakt } from '../../../typer/søknad';
import {
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import { erGyldigISøknadKontraktUtvidet } from '../../../utils/typeguards';
import { inputISøknad } from './testData1';
import { useSendInnSkjema } from './useSendInnSkjema';

describe('useSendInnSkjema', () => {
    it('mapper til gyldig utvidet kontrakt', async () => {
        silenceConsoleErrors();
        spyOnUseApp(inputISøknad);
        const { result } = renderHook(() => useSendInnSkjema(), {
            wrapper: TestProvidereMedEkteTekster,
        });
        const [_, formatert]: [boolean, ISøknadKontrakt] = await result.current.sendInnSkjema();
        expect(erGyldigISøknadKontraktUtvidet(formatert)).toBeTruthy();
    });
});
