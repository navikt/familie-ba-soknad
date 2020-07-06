import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.less';
import { AppProvider, useApp } from './context/AppContext';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Helse from './components/Helse/Helse';
import { verifiserAtBrukerErAutentisert } from './utils/autentisering';
import Forside from './components/Forside/Forside';
import { autentiseringsInterceptor } from './utils/autentisering';

function App() {
    const [autentisert, settAutentisering] = useState<boolean>(false);
    const { personData } = useApp();

    autentiseringsInterceptor();

    useEffect(() => {
        verifiserAtBrukerErAutentisert(settAutentisering);
    }, [autentisert]);

    console.log(personData);

    return autentisert ? (
        <AppProvider>
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact={true} path={'/'} component={Forside} />
                        <Route exact={true} path={'/helse'} component={Helse} />
                    </Switch>
                </Router>
            </div>
        </AppProvider>
    ) : (
        <NavFrontendSpinner className="spinner" />
    );
}

export default App;
