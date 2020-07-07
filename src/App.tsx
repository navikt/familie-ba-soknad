import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.less';
import { AppProvider } from './context/AppContext';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Helse from './components/Helse/Helse';
import { verifiserAtBrukerErAutentisert } from './utils/autentisering';
import Forside from './components/Forside/Forside';
<<<<<<< HEAD
=======

import { StegRoutes } from './routing/Routes';
>>>>>>> master
import { autentiseringsInterceptor, InnloggetStatus } from './utils/autentisering';
import Alertstripe from 'nav-frontend-alertstriper';

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
<<<<<<< HEAD
        <AppProvider innloggetStatus={innloggetStatus}>
=======
        <AppProvider>
>>>>>>> master
            <div className="App">
                {innloggetStatus === InnloggetStatus.AUTENTISERT && (
                    <Router>
                        <Switch>
<<<<<<< HEAD
                            <Route exact={true} path={'/'} component={Forside} />
                            <Route exact={true} path={'/helse'} component={Helse} />
=======
                            <Route exact={true} path={'/helse'} component={Helse} />
                            <Route exact={true} path={'/'} component={Forside} />
                            {StegRoutes &&
                                StegRoutes.map(steg => {
                                    return (
                                        <Route
                                            exact={true}
                                            path={steg.path}
                                            component={steg.komponent}
                                        />
                                    );
                                })}
>>>>>>> master
                        </Switch>
                    </Router>
                )}
                {innloggetStatus === InnloggetStatus.IKKE_VERIFISERT && <NavFrontendSpinner />}
                {innloggetStatus === InnloggetStatus.FEILET && (
                    <Alertstripe type="feil">En feil har oppstått!</Alertstripe>
                )}
            </div>
        </AppProvider>
    );
}

export default App;
