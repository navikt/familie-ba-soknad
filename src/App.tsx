import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.less';
import { AppProvider } from './context/AppContext';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Helse from './components/Helse/Helse';
import { verifiserAtBrukerErAutentisert } from './utils/autentisering';
import Forside from './components/Forside/Forside';
import { autentiseringsInterceptor } from './utils/autentisering';
import Feilmelding from './components/Feilmelding/Feilmelding';

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
                    </Switch>
                </Router>
            </div>
        </AppProvider>
    ) : (
        <AppProvider>
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact={true} path={'/'} component={NavFrontendSpinner} />
                        <Route exact={true} path={'/error'} component={Feilmelding} />
                    </Switch>
                </Router>
            </div>
        </AppProvider>
    );
}

export default App;
