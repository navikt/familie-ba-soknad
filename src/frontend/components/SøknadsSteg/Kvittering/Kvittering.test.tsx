import React from 'react';

import { render } from '@testing-library/react';
import { Router } from 'react-router';

import {
    mockHistory,
    silenceConsoleErrors,
    spyOnModal,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';

import Kvittering from './Kvittering';

describe('Kvittering', () => {
    test('Alle tekster finnes i språkfil', () => {
        silenceConsoleErrors();
        spyOnModal();

        const historyMock = mockHistory(['/kvittering']);

        render(
            <TestProvidereMedEkteTekster>
                <Router history={historyMock.mockedHistory}>
                    <Kvittering />
                </Router>
            </TestProvidereMedEkteTekster>
        );

        expect(console.error).toHaveBeenCalledTimes(0);
    });
});
