import React from 'react';

import { act, render } from '@testing-library/react';

import {
    silenceConsoleErrors,
    spyOnModal,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';

import Dokumentasjon from './Dokumentasjon';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: '/dokumentasjon',
    }),
    useHistory: () => ({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        push: () => {},
    }),
}));

describe('Dokumentasjon', () => {
    test('Alle tekster finnes i språkfil', async () => {
        silenceConsoleErrors();
        spyOnUseApp({});
        spyOnModal();

        await act(() => {
            render(
                <TestProvidereMedEkteTekster>
                    <Dokumentasjon />
                </TestProvidereMedEkteTekster>
            );
        });
        expect(console.error).toHaveBeenCalledTimes(0);
    });
});
