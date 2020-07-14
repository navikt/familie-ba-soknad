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
    const { systemetLaster, systemetFeiler, innloggetStatus, harTilgang } = useApp();
    return (
        <main className="App">
            {systemetLaster() && <SystemetLaster />}
            {innloggetStatus === InnloggetStatus.AUTENTISERT && !systemetFeiler() && (
                <>
                    {!harTilgang && (
                        <Alertstripe type="advarsel">
                            {'Du må søke på papir. '}
                            <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                                Klikk her for å gå til våre sider for barnetrygd
                            </a>
                        </Alertstripe>
                    )}
                    <div className={classNames((systemetLaster() || !harTilgang) && 'blur')}>
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
                </>
            )}
            {systemetFeiler() && !systemetLaster() && (
                <Alertstripe type="feil">En feil har oppstått!</Alertstripe>
            )}
        </main>
    );
};

export default Søknad;
