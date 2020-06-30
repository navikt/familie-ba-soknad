import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.less';
import { Systemtittel } from 'nav-frontend-typografi';
import { AppProvider } from './context/AppContext';
import Helse from './components/Helse/Helse';
import VeilederSnakkebolbe from './assets/VeilederSnakkeboble';
import Forside from './components/Forside/Forside';

function App() {
    return (
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
    );
}

export default App;
