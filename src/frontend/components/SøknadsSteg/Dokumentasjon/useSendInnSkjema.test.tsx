import { renderHook } from '@testing-library/react-hooks';

import {
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import { erGyldigUtvidetISøknadKontrakt } from '../../../utils/typeguards';
import { inputISøknad } from './testData1';
import { useSendInnSkjema } from './useSendInnSkjema';

describe('useSendInnSkjema', () => {
    it('mapper til gyldig utvidet kontrakt', async () => {
        silenceConsoleErrors();
        spyOnUseApp(inputISøknad);
        const { result } = renderHook(() => useSendInnSkjema(), {
            wrapper: TestProvidereMedEkteTekster,
        });
        const [_, formatert] = await result.current.sendInnSkjema();
        expect(erGyldigUtvidetISøknadKontrakt(formatert)).toBeTruthy();
    });
});
