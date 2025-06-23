import React from 'react';

import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { LastRessurserProvider, useLastRessurserContext } from './LastRessurserContext';

describe('LastRessurserContext', () => {
    test(`Kan vise at ressurser laster når vi bruker axios-funksjonen til contexten`, async () => {
        // For å kunne sjekke state underveis bruker vi falske timere og delay på requesten vi mocker
        vi.useFakeTimers();

        const wrapper = ({ children }) => <LastRessurserProvider>{children}</LastRessurserProvider>;
        const { result } = renderHook(() => useLastRessurserContext(), { wrapper });

        expect(result.current.lasterRessurser()).toEqual(false);

        const axiosRequest = result.current.axiosRequest;

        act(() => {
            axiosRequest<number, void>({
                url: `/modellversjon`,
                påvirkerSystemLaster: true,
            });
        });

        expect(result.current.lasterRessurser()).toEqual(true);

        vi.runAllTimers();
        vi.useRealTimers();

        await waitFor(() => expect(result.current.lasterRessurser()).toEqual(false));
    });

    test(`Kan vise at ressurser laster når vi bruker wrapMedSystemetLaster på custome promises`, async () => {
        const wrapper = ({ children }) => <LastRessurserProvider>{children}</LastRessurserProvider>;
        const { result } = renderHook(() => useLastRessurserContext(), { wrapper });

        let promiseResolve;

        const promise = new Promise(function (resolve) {
            promiseResolve = resolve;
        });

        expect(result.current.lasterRessurser()).toEqual(false);

        act(() => {
            result.current.wrapMedSystemetLaster(async () => await promise);
        });

        expect(result.current.lasterRessurser()).toEqual(true);

        promiseResolve();

        await waitFor(() => expect(result.current.lasterRessurser()).toEqual(false));
    });
});
