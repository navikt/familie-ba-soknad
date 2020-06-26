import React, { useState, useEffect } from 'react';
import './App.less';
import { Systemtittel } from 'nav-frontend-typografi';
import { AppProvider } from './context/AppContext';
import Helse from './components/Helse/Helse';
import { verifiserAtBrukerErAutentisert, autentiseringsInterceptor } from './utils/autentisering';

function App() {
    const [autentisert, settAutentisering] = useState<boolean>(false);

    autentiseringsInterceptor();

    useEffect(() => {
        verifiserAtBrukerErAutentisert(settAutentisering);
    }, [autentisert]);
    console.log('Autentisert:' + autentisert);

    return (
        <AppProvider>
            <div className="App">
                <Systemtittel>Søknad om barnetrygd</Systemtittel>
                <Helse />
            </div>
        </AppProvider>
    );
}

export default App;
