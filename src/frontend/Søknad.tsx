import React from 'react';

import classNames from 'classnames';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import RedirectTilStart from './components/Felleskomponenter/RedirectTilStart/RedirectTilStart';
import Helse from './components/Helse/Helse';
import Forside from './components/SøknadsSteg/Forside/Forside';
import { useApp } from './context/AppContext';
import { useRoutes } from './context/RoutesContext';
import { basePath } from './Miljø';

const Søknad = () => {
    const { systemetLaster } = useApp();
    const { routes } = useRoutes();

    return (
        <div className={classNames(systemetLaster() && 'blur')}>
            <Router basename={basePath}>
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
