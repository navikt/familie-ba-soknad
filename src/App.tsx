import React from 'react';
import './App.less';
import { AppProvider } from './context/AppContext';
import Søknad from './Søknad';
import AlertStripe from 'nav-frontend-alertstriper';

function App() {
    return (
        <AppProvider>
            <AlertStripe type="advarsel">
                {`Denne siden er under utvikling. `}
                <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                    Klikk her for å gå til våre sider for barnetrygd
                </a>
            </AlertStripe>
            <Søknad />
        </AppProvider>
    );
}

export default App;
