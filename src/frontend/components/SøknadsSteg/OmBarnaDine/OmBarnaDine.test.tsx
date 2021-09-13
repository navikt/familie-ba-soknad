import React from 'react';

import { render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { ISøknad } from '../../../typer/søknad';
import {
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import OmBarnaDine from './OmBarnaDine';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: '/om-barna',
    }),
    useHistory: () => ({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        push: () => {},
    }),
}));

const søknad = mockDeep<ISøknad>({
    barnInkludertISøknaden: [
        {
            ident: '1234',
        },
    ],
});

describe('OmBarnaDine', () => {
    silenceConsoleErrors();
    test('Alle tekster finnes i språkfil', () => {
        spyOnUseApp(søknad);
        render(
            <TestProvidereMedEkteTekster>
                <OmBarnaDine />
            </TestProvidereMedEkteTekster>
        );
        expect(console.error).toHaveBeenCalledTimes(0);
    });
});
