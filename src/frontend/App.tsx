import React from 'react';

import AlertStripe from 'nav-frontend-alertstriper';

import AppContainer from './AppContainer';
import { AppProvider } from './context/AppContext';
import { AppNavigationProvider } from './context/AppNavigationContext';
import { EøsProvider } from './context/EøsContext';
import { FeatureTogglesProvider } from './context/FeatureToggleContext';
import { InnloggetProvider } from './context/InnloggetContext';
import { LastRessurserProvider } from './context/LastRessurserContext';
import { RoutesProvider } from './context/RoutesContext';
import { GlobalStyle } from './Theme';

function App() {
    return (
        <LastRessurserProvider>
            <InnloggetProvider>
                <FeatureTogglesProvider>
                    <AppProvider>
                        <EøsProvider>
                            <GlobalStyle />
                            {process.env.NODE_ENV !== 'production' && (
                                <AlertStripe type="advarsel">
                                    {`Denne siden er under utvikling. `}
                                    <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                                        Klikk her for å gå til våre sider for barnetrygd
                                    </a>
                                </AlertStripe>
                            )}
                            <RoutesProvider>
                                <AppNavigationProvider>
                                    <AppContainer />
                                </AppNavigationProvider>
                            </RoutesProvider>
                        </EøsProvider>
                    </AppProvider>
                </FeatureTogglesProvider>
            </InnloggetProvider>
        </LastRessurserProvider>
    );
}

export default App;
