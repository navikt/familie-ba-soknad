import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.less';
import { AppProvider } from './context/AppContext';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Helse from './components/Helse/Helse';
import { verifiserAtBrukerErAutentisert } from './utils/autentisering';
import Forside from './components/Forside/Forside';
import Steg1 from './components/Steg/Steg1/Steg1';
import Steg3 from './components/Steg/Steg3/Steg3';
import Steg4 from './components/Steg/Steg4/Steg4';
import Steg2 from './components/Steg/Steg2/Steg2';
import { autentiseringsInterceptor } from './utils/autentisering';

function App() {
    const [autentisert, settAutentisering] = useState<boolean>(false);

    autentiseringsInterceptor();

    useEffect(() => {
        verifiserAtBrukerErAutentisert(settAutentisering);
    }, [autentisert]);

    return autentisert ? (
        <AppProvider>
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact={true} path={'/'} component={Forside} />
                        <Route exact={true} path={'/helse'} component={Helse} />
                        <Route exact={true} path={'/steg1'} component={Steg1} />
                        <Route exact={true} path={'/steg2'} component={Steg2} />
                        <Route exact={true} path={'/steg3'} component={Steg3} />
                        <Route exact={true} path={'/steg4'} component={Steg4} />
                    </Switch>
                </Router>
            </div>
        </AppProvider>
    ) : (
        <NavFrontendSpinner className="spinner" />
    );
}

export default App;
