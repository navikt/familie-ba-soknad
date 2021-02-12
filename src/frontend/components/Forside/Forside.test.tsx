import React from 'react';

import { render, screen } from '@testing-library/react';

import { AppProvider } from '../../context/AppContext';
import Forside from './Forside';

test('Kan rendre Forside', () => {
    render(
        <AppProvider>
            <Forside />
        </AppProvider>
    );
    expect(screen.getByText('Søknad om barnetrygd')).toBeInTheDocument();
});
