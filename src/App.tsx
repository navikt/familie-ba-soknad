import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.less';
import { AppProvider } from './context/AppContext';
import Helse from './components/Helse/Helse';
import Forside from './components/Forside/Forside';
import Side from './components/Side/Side';

function App() {
    return (
        <AppProvider>
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact={true} path={'/'} component={Forside} />
                        <Route exact={true} path={'/helse'} component={Helse} />
                        <Route exact={true} path={'/steg'} component={Side} />
                    </Switch>
                </Router>
            </div>
        </AppProvider>
    );
}

export default App;
