import React from 'react';

import { render, fireEvent } from '@testing-library/react';

import { RouteEnum } from '../../../routing/Routes';
import { brukUseAppMedTomSøknadForRouting } from '../../../utils/testing';
import Oppsummeringsbolk from './Oppsummeringsbolk';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: 'localhost:3000/example/path',
    }),
}));

test('Skal rendre barn i oppsummeringsbolk', () => {
    brukUseAppMedTomSøknadForRouting();
    const infotekst = 'Det er noe inni her også';
    const { getByText, getByRole, queryAllByText } = render(
        <Oppsummeringsbolk tittel={'oppsummeringstittel'} lenke={RouteEnum.Kvittering}>
            <div>{infotekst}</div>
        </Oppsummeringsbolk>
    );

    expect(getByText('oppsummeringstittel')).toBeInTheDocument();
    expect(queryAllByText(infotekst).length).toBe(0);

    fireEvent.click(getByRole('button'));
    expect(getByText(infotekst)).toBeInTheDocument();
});
