import React from 'react';

import { createPortal } from 'react-dom';

import AlertStripe from 'nav-frontend-alertstriper';

import AppContainer from './AppContainer';
import { AppProvider } from './context/AppContext';
import { RoutesProvider } from './context/RoutesContext';

const DevAdvarsel: React.FC = () => {
    return process.env.NODE_ENV !== 'production' ? (
        <AlertStripe type="advarsel">
            {`Denne siden er under utvikling. `}
            <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                Klikk her for å gå til våre sider for barnetrygd
            </a>
        </AlertStripe>
    ) : null;
};

const DevAdvarselIPortal: React.FC = () => {
    const header = document.querySelector('header');
    return header ? createPortal(<DevAdvarsel />, header) : <DevAdvarsel />;
};

function App() {
    return (
        <AppProvider>
            <DevAdvarselIPortal />
            <RoutesProvider>
                <AppContainer />
            </RoutesProvider>
        </AppProvider>
    );
}

export default App;
