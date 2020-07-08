import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.less';
import { useApp } from './context/AppContext';
import Helse from './components/Helse/Helse';
import Forside from './components/Forside/Forside';
import { StegRoutes } from './routing/Routes';
import { InnloggetStatus } from './utils/autentisering';
import Alertstripe from 'nav-frontend-alertstriper';
import classNames from 'classnames';
import SystemetLaster from './components/Felleskomponenter/SystemetLaster/SystemetLaster';

const Søknad = () => {
    const { systemetLaster, systemetFeiler, innloggetStatus } = useApp();
    return (
        <main className="App">
            {innloggetStatus === InnloggetStatus.AUTENTISERT && (
                <div className={classNames(systemetLaster() && 'blur')}>
                    <Router>
                        <Switch>
                            <Route exact={true} path={'/helse'} component={Helse} />
                            <Route exact={true} path={'/'} component={Forside} />
                            {StegRoutes &&
                                StegRoutes.map((steg, index) => {
                                    return (
                                        <Route
                                            key={index}
                                            exact={true}
                                            path={steg.path}
                                            component={steg.komponent}
                                        />
                                    );
                                })}
                        </Switch>
                    </Router>
                </div>
            )}
            {systemetLaster() && <SystemetLaster />}
            {systemetFeiler() && <Alertstripe type="feil">En feil har oppstått!</Alertstripe>}
        </main>
    );
};

export default Søknad;
