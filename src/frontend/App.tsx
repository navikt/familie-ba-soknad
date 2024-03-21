import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import { basePath } from '../shared-utils/Miljø';

import AppContainer from './AppContainer';
import FamilieAlert from './components/Felleskomponenter/FamilieAlert/FamilieAlert';
import { AppProvider } from './context/AppContext';
import { AppNavigationProvider } from './context/AppNavigationContext';
import { EøsProvider } from './context/EøsContext';
import { RoutesProvider } from './context/RoutesContext';
import { StegProvider } from './context/StegContext';
import { GlobalStyle } from './Theme';

function App() {
    const basePathPrefiks = window.location.pathname.includes('/familie') ? '/familie' : '';
    const basePathGittInngangsUrl = `${basePathPrefiks}${basePath}`;

    return (
        <AppProvider>
            <EøsProvider>
                <RoutesProvider>
                    <Router basename={basePathGittInngangsUrl}>
                        <StegProvider>
                            <GlobalStyle />
                            {process.env.NODE_ENV !== 'production' && (
                                <FamilieAlert variant={'warning'} inline={false}>
                                    {`Denne siden er under utvikling. `}
                                    <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                                        Klikk her for å gå til våre sider for barnetrygd
                                    </a>
                                </FamilieAlert>
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
