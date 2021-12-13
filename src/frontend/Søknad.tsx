import React from 'react';

import classNames from 'classnames';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { DekoratørenSpråkHandler } from './components/Felleskomponenter/Dekoratøren/DekoratørenSpråkHandler';
import RedirectTilStart from './components/Felleskomponenter/RedirectTilStart/RedirectTilStart';
import Helse from './components/Helse/Helse';
import DinLivssituasjon from './components/SøknadsSteg/DinLivssituasjon/DinLivssituasjon';
import Dokumentasjon from './components/SøknadsSteg/Dokumentasjon/Dokumentasjon';
import EøsForBarn from './components/SøknadsSteg/EøsSteg/Barn/EøsForBarn';
import EøsForSøker from './components/SøknadsSteg/EøsSteg/Søker/EøsForSøker';
import Forside from './components/SøknadsSteg/Forside/Forside';
import Kvittering from './components/SøknadsSteg/Kvittering/Kvittering';
import OmBarnaDine from './components/SøknadsSteg/OmBarnaDine/OmBarnaDine';
import OmBarnet from './components/SøknadsSteg/OmBarnet/OmBarnet';
import OmDeg from './components/SøknadsSteg/OmDeg/OmDeg';
import Oppsummering from './components/SøknadsSteg/Oppsummering/Oppsummering';
import VelgBarn from './components/SøknadsSteg/VelgBarn/VelgBarn';
import { useApp } from './context/AppContext';
import { useRoutes } from './context/RoutesContext';
import { routerBasePath } from './Miljø';
import { BarnetsId } from './typer/common';
import { IRoute, RouteEnum } from './typer/routes';

const Søknad = () => {
    const { systemetLaster } = useApp();
    const { routes } = useRoutes();

    const routeTilKomponent = (route: IRoute): React.FC => {
        switch (route.route) {
            case RouteEnum.Forside:
                return Forside;
            case RouteEnum.OmDeg:
                return OmDeg;
            case RouteEnum.DinLivssituasjon:
                return DinLivssituasjon;
            case RouteEnum.VelgBarn:
                return VelgBarn;
            case RouteEnum.OmBarna:
                return OmBarnaDine;
            case RouteEnum.OmBarnet:
                return () => <OmBarnet barnetsId={route.spesifisering as BarnetsId} />;
            case RouteEnum.EøsForSøker:
                return EøsForSøker;
            case RouteEnum.EøsForBarn:
                return () => <EøsForBarn barnetsId={route.spesifisering as BarnetsId} />;
            case RouteEnum.Oppsummering:
                return Oppsummering;
            case RouteEnum.Dokumentasjon:
                return Dokumentasjon;
            case RouteEnum.Kvittering:
                return Kvittering;
        }
    };

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
                            component={routeTilKomponent(steg)}
                        />
                    ))}
                    <Route path={'*'} component={Forside} />
                </Switch>
            </Router>
        </div>
    );
};

export default Søknad;
