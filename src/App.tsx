import React from 'react';
import './App.less';
import { AppProvider } from './context/AppContext';
import Søknad from './Søknad';
import AlertStripe from 'nav-frontend-alertstriper';

function App() {
    return (
        <AppProvider>
            <AlertStripe type="advarsel">
                Denne siden er under utvikling og skal ikke brukes.
                <a href="https://nav.no">Vennligst besøk nav.no</a>
            </AlertStripe>
            <Søknad />
        </AppProvider>
    );
}

export default App;
