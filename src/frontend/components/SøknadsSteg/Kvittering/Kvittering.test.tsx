import React from 'react';

import { render } from '@testing-library/react';

import {
    silenceConsoleErrors,
    spyOnModal,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';

import Kvittering from './Kvittering';

describe('Kvittering', () => {
    test('Alle tekster finnes i språkfil', () => {
        silenceConsoleErrors();
        spyOnModal();

        render(
            <TestProvidereMedEkteTekster mocketNettleserHistorikk={['/kvittering']}>
                <Kvittering />
            </TestProvidereMedEkteTekster>
        );

        expect(console.error).toHaveBeenCalledTimes(0);
    });
});
