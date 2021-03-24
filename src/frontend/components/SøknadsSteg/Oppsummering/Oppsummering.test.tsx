import React from 'react';

// import { render } from '@testing-library/react';
//
// import { AppProvider } from '../../../context/AppContext';
// import Oppsummering from './Oppsummering';
//
jest.mock('./Oppsummeringsbolk', () => () => <div data-testid="oppsummeringsbolk" />);

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: 'localhost:3000/example/path',
    }),
}));

test('Skal rendre tre informasjonsbolker', () => {
    // const { getAllByTestId } = render(
    //     <AppProvider>
    //         <Oppsummering />
    //     </AppProvider>
    // );
    // expect(getAllByTestId(/oppsummeringsbolk/).length).toBe(3);
});
