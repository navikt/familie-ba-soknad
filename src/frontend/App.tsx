import React from 'react';

import AlertStripe from 'nav-frontend-alertstriper';

import { AppProvider } from './context/AppContext';
import { RoutesProvider } from './routing/RoutesContext';
import Søknad from './Søknad';

function App() {
    return (
        <AppProvider>
            <RoutesProvider>
                <AlertStripe type="advarsel">
                    {`Denne siden er under utvikling. `}
                    <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                        Klikk her for å gå til våre sider for barnetrygd
                    </a>
                </AlertStripe>
                <Søknad />
            </RoutesProvider>
        </AppProvider>
    );
}

export default App;
