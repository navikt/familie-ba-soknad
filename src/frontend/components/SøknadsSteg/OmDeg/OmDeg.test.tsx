import React from 'react';

import { render } from '@testing-library/react';

import { TestProvidereMedEkteTekster } from '../../../utils/testing';
import OmDeg from './OmDeg';

jest.mock('nav-frontend-alertstriper', () => () => <div data-testid="alertstripe" />);

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: 'localhost:3000/example/path',
    }),
}));

test('Skal rendre alertstripe i OmDeg', () => {
    const { getByTestId } = render(
        <TestProvidereMedEkteTekster>
            <OmDeg />
        </TestProvidereMedEkteTekster>
    );
    expect(getByTestId(/alertstripe/)).toBeInTheDocument();
});
