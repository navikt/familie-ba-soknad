import React from 'react';

import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { AppProvider, useApp } from './AppContext';

describe('erStegUtfyltFraFør', () => {
    let hookResult;

    beforeEach(() => {
        const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
        const { result } = renderHook(() => useApp(), { wrapper });
        hookResult = result;
    });

    test('Skal returnere true dersom siste utfylte steg er det samme som nåværende steg', () => {
        const nåværendeStegIndex = 2;
        const { settSisteUtfylteStegIndex } = hookResult.current;
        act(() => {
            settSisteUtfylteStegIndex(2);
        });
        expect(hookResult.current.erStegUtfyltFrafør(nåværendeStegIndex)).toEqual(true);
    });

    test('Skal returnere true dersom siste utfylte steg er etter nåværende steg', () => {
        const nåværendeStegIndex = 2;
        const { settSisteUtfylteStegIndex } = hookResult.current;
        act(() => {
            settSisteUtfylteStegIndex(3);
        });
        expect(hookResult.current.erStegUtfyltFrafør(nåværendeStegIndex)).toEqual(true);
    });

    test('Skal returnere false dersom siste utfylte steg er før nåværende steg', () => {
        const nåværendeStegIndex = 2;
        const { settSisteUtfylteStegIndex } = hookResult.current;
        act(() => {
            settSisteUtfylteStegIndex(1);
        });
        expect(hookResult.current.erStegUtfyltFrafør(nåværendeStegIndex)).toEqual(false);
    });
});
