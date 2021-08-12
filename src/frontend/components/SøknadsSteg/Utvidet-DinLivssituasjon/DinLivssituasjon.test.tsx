import React from 'react';

import { queryByText, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { silenceConsoleErrors, TestProvidereMedEkteTekster } from '../../../utils/testing';
import DinLivssituasjon from './DinLivssituasjon';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: '/din-livssituasjon',
    }),
    useHistory: () => ({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        push: () => {},
    }),
}));

jest.mock('nav-frontend-alertstriper', () => ({ children }) => (
    <div data-testid="alertstripe">{children}</div>
));

describe('DinLivssituasjon', () => {
    it('rendrer DinLivssituasjon steg og inneholder sidetittel', () => {
        silenceConsoleErrors();
        const { getByText } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        expect(getByText('Din livssituasjon')).toBeInTheDocument();
    });

    it('Stopper fra å gå videre hvis årsak ikke er valgt', () => {
        silenceConsoleErrors();
        const { getByText, getByRole } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        const gåVidere = getByText('GÅ VIDERE');
        act(() => gåVidere.click());
        const alerts: HTMLElement = getByRole('alert');
        const result: HTMLElement | null = queryByText(
            alerts,
            'Hvorfor søker du om utvidet barnetrygd?'
        );
        expect(result).not.toBeNull();
    });
});
