import React from 'react';

import { render } from '@testing-library/react';

import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import norskeTekster from '../../../assets/lang/nb.json';
import { AppProvider } from '../../../context/AppContext';
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
        <AppProvider>
            <SprakProvider tekster={{ nb: norskeTekster }} defaultLocale={LocaleType.nb}>
                <OmDeg />
            </SprakProvider>
        </AppProvider>
    );
    expect(getByTestId(/alertstripe/)).toBeInTheDocument();
});
