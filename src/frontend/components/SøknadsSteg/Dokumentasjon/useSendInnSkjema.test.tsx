import { renderHook } from '@testing-library/react-hooks';

import {
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import { inputISøknad, outputSoknadKontrakt } from './testData1';
import { useSendInnSkjema } from './useSendInnSkjema';

describe('useSendInnSkjema', () => {
    it('test1', async () => {
        silenceConsoleErrors();
        spyOnUseApp(inputISøknad);
        const { result } = renderHook(() => useSendInnSkjema(), {
            wrapper: TestProvidereMedEkteTekster,
        });
        const [_, formatert] = await result.current.sendInnSkjema();
        expect(formatert).toEqual(outputSoknadKontrakt);
    });
});
