import React from 'react';

import classNames from 'classnames';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Forside from './components/Forside/Forside';
import Helse from './components/Helse/Helse';
import { useApp } from './context/AppContext';
import { useRoutes } from './routing/RoutesContext';

const Søknad = () => {
    const { systemetLaster } = useApp();
    const { routes } = useRoutes();

    return (
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
    );
};

export default Søknad;
