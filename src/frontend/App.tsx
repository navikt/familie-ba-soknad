import React from 'react';

import AlertStripe from 'nav-frontend-alertstriper';

import AppContainer from './AppContainer';
import { AppProvider } from './context/AppContext';
import { RoutesProvider } from './context/RoutesContext';

function App() {
    return (
        <AppProvider>
            {process.env.NODE_ENV !== 'production' && (
                <AlertStripe type="advarsel">
                    {`Denne siden er under utvikling. `}
                    <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                        Klikk her for å gå til våre sider for barnetrygd
                    </a>
                </AlertStripe>
            )}
            <RoutesProvider>
                <AppContainer />
            </RoutesProvider>
        </AppProvider>
    );
}

export default App;
