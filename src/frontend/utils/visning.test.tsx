import React from 'react';

import { render } from '@testing-library/react';

import { ESøknadstype } from '../typer/søknad';
import { visLabelOgSvar } from './visning';

test(`Test at rendrer både label og svar`, () => {
    const { getByText } = render(
        <div>{visLabelOgSvar({ label: 'TestLabel', verdi: 'TestVerdi' }, '2rem')}</div>
    );

    expect(getByText(/TestLabel/)).toBeInTheDocument();
    expect(getByText(/TestVerdi/)).toBeInTheDocument();
});

test(`Test at rendrer ESøknadstype`, () => {
    const { getByText } = render(
        <div>{visLabelOgSvar({ label: 'TestLabel', verdi: ESøknadstype.ORDINÆR }, '1rem')}</div>
    );
    expect(getByText(/Ordinær/)).toBeInTheDocument();
});
