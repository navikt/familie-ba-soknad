import React from 'react';

import { BrowserRouter as Router } from 'react-router';

import { Alert } from '@navikt/ds-react';

import { BASE_PATH } from '../shared-utils/miljø';

import AppContainer from './AppContainer';
import { AppProvider } from './context/AppContext';
import { AppNavigationProvider } from './context/AppNavigationContext';
import { EøsProvider } from './context/EøsContext';
import { RoutesProvider } from './context/RoutesContext';
import { StegProvider } from './context/StegContext';
import { GlobalStyle } from './Theme';

function App() {
    return (
        <AppProvider>
            <EøsProvider>
                <RoutesProvider>
                    <Router basename={BASE_PATH}>
                        <StegProvider>
                            <GlobalStyle />
                            {process.env.NODE_ENV !== 'production' && (
                                <Alert variant={'warning'}>
                                    {`Denne siden er under utvikling. `}
                                    <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                                        Klikk her for å gå til våre sider for barnetrygd
                                    </a>
                                </Alert>
                            )}
                            <AppNavigationProvider>
                                <AppContainer />
                            </AppNavigationProvider>
                        </StegProvider>
                    </Router>
                </RoutesProvider>
            </EøsProvider>
        </AppProvider>
    );
}

export default App;
