import React, { useState, useEffect } from 'react';
import './App.less';
import { AppProvider } from './context/AppContext';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { verifiserAtBrukerErAutentisert } from './utils/autentisering';

import { autentiseringsInterceptor, InnloggetStatus } from './utils/autentisering';
import Alertstripe from 'nav-frontend-alertstriper';
import Søknad from './Søknad';

function App() {
    const [innloggetStatus, settInnloggetStatus] = useState<InnloggetStatus>(
        InnloggetStatus.IKKE_VERIFISERT
    );

    autentiseringsInterceptor();

    useEffect(() => {
        if (innloggetStatus === InnloggetStatus.IKKE_VERIFISERT) {
            verifiserAtBrukerErAutentisert(settInnloggetStatus);
        }
    }, [innloggetStatus]);

    return (
        <AppProvider innloggetStatus={innloggetStatus}>
            <Søknad />
        </AppProvider>
    );
}

export default App;
