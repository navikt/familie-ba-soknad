import React, { useState, useEffect } from 'react';
import './App.less';
import { Systemtittel } from 'nav-frontend-typografi';
import { AppProvider } from './context/AppContext';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Helse from './components/Helse/Helse';
import { verifiserAtBrukerErAutentisert } from './utils/autentisering';

function App() {
    const [autentisert, settAutentisering] = useState<boolean>(false);

    useEffect(() => {
        verifiserAtBrukerErAutentisert(settAutentisering);
    }, [autentisert]);

    if (autentisert) {
        return (
            <AppProvider>
                <div className="App">
                    <Systemtittel>Søknad om barnetrygd</Systemtittel>
                    <Helse />
                </div>
            </AppProvider>
        );
    } else {
        return <NavFrontendSpinner className="spinner" />;
    }
}

export default App;
