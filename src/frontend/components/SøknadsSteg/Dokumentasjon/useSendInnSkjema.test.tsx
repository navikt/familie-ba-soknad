import { act, renderHook } from '@testing-library/react-hooks';

import { silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import { inputISøknad } from './testData1';
import { useSendInnSkjema } from './useSendInnSkjema';
//
// jest.mock('axios');
// const axios = require('axios');

describe('useSendInnSkjema', () => {
    it('test1', async () => {
        silenceConsoleErrors();

        spyOnUseApp(inputISøknad);

        const { result } = renderHook(() => useSendInnSkjema(), {
            wrapper: TestProvidere,
        });

        // axios.request.mockImplementation(config => {
        //     return true;
        // });

        act(async () => {
            const [bool, formatert] = await result.current.sendInnSkjema();
            console.info(bool);
            console.info(formatert);
        });
    });
});
