import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.less';
import { Systemtittel } from 'nav-frontend-typografi';
import { AppProvider } from './context/AppContext';
import Helse from './components/Helse/Helse';
import VeilederSnakkebolbe from './assets/VeilederSnakkeboble';

function App() {
    return (
        <AppProvider>
            <div className="App">
                <Router>
                    <Switch>
                        <Route
                            exact={true}
                            path={'/'}
                            render={() => {
                                return (
                                    <>
                                        <Systemtittel>Søknad om barnetrygd</Systemtittel>
                                        <VeilederSnakkebolbe></VeilederSnakkebolbe>
                                    </>
                                );
                            }}
                        />
                        <Route exact={true} path={'/helse'} component={Helse} />
                    </Switch>
                </Router>
            </div>
        </AppProvider>
    );
}

export default App;
