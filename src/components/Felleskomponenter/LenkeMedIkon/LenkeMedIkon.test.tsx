import React from 'react';

import { render, screen } from '@testing-library/react';

import LenkeMedIkon from '../LenkeMedIkon/LenkeMedIkon';

test('Kan rendre LenkeMedIkon', () => {
    render(
        <LenkeMedIkon
            onClick={() => {
                //do nothing
            }}
        />
    );
    expect(screen.getByAltText('Endre')).toBeInTheDocument();
});
