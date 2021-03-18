import React from 'react';

import classNames from 'classnames';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Alertstripe from 'nav-frontend-alertstriper';

import { RessursStatus } from '@navikt/familie-typer';

import SystemetLaster from './components/Felleskomponenter/SystemetLaster/SystemetLaster';
import Forside from './components/Forside/Forside';
import Helse from './components/Helse/Helse';
import { useApp } from './context/AppContext';
import { StegRoutes } from './routing/Routes';

const Søknad = () => {
    const { systemetLaster, systemetFeiler, sluttbruker, systemetOK } = useApp();
    return (
        <div>
            {systemetLaster() && <SystemetLaster />}
            {sluttbruker.status === RessursStatus.IKKE_TILGANG && (
                <main>
                    <Alertstripe type="advarsel">
                        {'Du må søke på papir. '}
                        <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                            Klikk her for å gå til våre sider for barnetrygd
                        </a>
                    </Alertstripe>
                </main>
            )}
            {systemetOK() && (
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
            {systemetFeiler() && !systemetLaster() && (
                <main>
                    <Alertstripe type="feil">En feil har oppstått!</Alertstripe>
                </main>
            )}
        </div>
    );
};

export default Søknad;
