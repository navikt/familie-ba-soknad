import React from 'react';

import { render, screen } from '@testing-library/react';

import { Normaltekst } from 'nav-frontend-typografi';

import Informasjonsbolk from './Informasjonsbolk';

test('Kan rendre Informasjonsbolk', () => {
    render(<Informasjonsbolk tittel={'Test'} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
});

test('Kan rendre underelementer', () => {
    render(
        <Informasjonsbolk tittel={'Hallo'}>
            <Normaltekst>Eksempeltekst</Normaltekst>
        </Informasjonsbolk>
    );
    expect(screen.getByText('Eksempeltekst')).toBeInTheDocument();
});
