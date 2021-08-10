import React from 'react';

import classNames from 'classnames';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { DekoratørenSpråkHandler } from './components/Felleskomponenter/Dekoratøren/DekoratørenSpråkHandler';
import RedirectTilStart from './components/Felleskomponenter/RedirectTilStart/RedirectTilStart';
import Helse from './components/Helse/Helse';
import Forside from './components/SøknadsSteg/Forside/Forside';
import { useApp } from './context/AppContext';
import { useRoutes } from './context/RoutesContext';
import { basePath } from './Miljø';

const Søknad = () => {
    const { systemetLaster } = useApp();
    const { routes } = useRoutes();
    const { pathname } = window.location;

    /**
     * Vi må fortsatt hente scripts og ressurser fra /ordinaer med mindre vi ønsker å gjøre
     * endringer på express-appen, og vi kan forwarde requests til APIet via /ordinaer, det eneste
     * som må endres for å støtte utvidet søknad er basepath for react-routeren, derfor gjør vi dette her.
     */
    const routerBasePath = pathname.split('/').includes('utvidet')
        ? basePath.replace('ordinaer', 'utvidet')
        : basePath;

    return (
        <div className={classNames(systemetLaster() && 'blur')}>
            <DekoratørenSpråkHandler />
            <Router basename={routerBasePath}>
                <Switch>
                    <Route exact={true} path={'/helse'} component={Helse} />
                    <Route exact={true} path={'/'} component={Forside} />
                    {routes.map((steg, index) => (
                        <RedirectTilStart
                            key={index}
                            exact={true}
                            path={steg.path}
                            component={steg.komponent}
                        />
                    ))}
                    <Route path={'*'} component={Forside} />
                </Switch>
            </Router>
        </div>
    );
};

export default Søknad;
