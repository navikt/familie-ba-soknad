import React from 'react';

import { Route, Redirect, RouteProps, RouteComponentProps, useLocation } from 'react-router-dom';

import { useApp } from '../../../context/AppContext';
import { useRoutes } from '../../../context/RoutesContext';
import { ILokasjon } from '../../../typer/lokasjon';

interface RedirectTilStartProps extends RouteProps {
    // eslint-disable-next-line
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}
const RedirectTilStart: React.FC<RedirectTilStartProps> = ({ component: Component, ...rest }) => {
    const location = useLocation<ILokasjon>();
    const { sisteUtfylteStegIndex } = useApp();
    const { erPåKvitteringsside } = useRoutes();

    return (
        <Route
            {...rest}
            render={props =>
                sisteUtfylteStegIndex === -1 && !erPåKvitteringsside(location.pathname) ? (
                    <Redirect to={'/'} />
                ) : (
                    <Component {...props} />
                )
            }
        />
    );
};

export default RedirectTilStart;
