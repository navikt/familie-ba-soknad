import React from 'react';

import classNames from 'classnames';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Alertstripe from 'nav-frontend-alertstriper';

import { RessursStatus } from '@navikt/familie-typer';

import SystemetLaster from './components/Felleskomponenter/SystemetLaster/SystemetLaster';
import Forside from './components/Forside/Forside';
import Helse from './components/Helse/Helse';
import { useApp } from './context/AppContext';
import { useRoutes } from './routing/RoutesContext';

const Søknad = () => {
    const { systemetLaster, systemetFeiler, sluttbruker, systemetOK } = useApp();
    const { routes } = useRoutes();
    return (
        <main>
            {systemetLaster() && <SystemetLaster />}
            {sluttbruker.status === RessursStatus.IKKE_TILGANG && (
                <div>
                    <Alertstripe type="advarsel">
                        {'Du må søke på papir. '}
                        <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                            Klikk her for å gå til våre sider for barnetrygd
                        </a>
                    </Alertstripe>
                </div>
            )}
            {systemetOK() && (
                <div className={classNames(systemetLaster() && 'blur')}>
                    <Router>
                        <Switch>
                            <Route exact={true} path={'/helse'} component={Helse} />
                            <Route exact={true} path={'/'} component={Forside} />
                            {routes.map((steg, index) => (
                                <Route
                                    key={index}
                                    exact={true}
                                    path={steg.path}
                                    component={steg.komponent}
                                />
                            ))}
                        </Switch>
                    </Router>
                </div>
            )}
            {systemetFeiler() && !systemetLaster() && (
                <div>
                    <Alertstripe type="feil">En feil har oppstått!</Alertstripe>
                </div>
            )}
        </main>
    );
};

export default Søknad;
