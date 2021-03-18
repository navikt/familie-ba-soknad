import React from 'react';

import { Location } from 'history';

import OmDeg from '../components/SøknadsSteg/1-OmDeg/OmDeg';
import Søknadstype from '../components/SøknadsSteg/2-Søknadstype/Søknadstype';
import VelgBarn from '../components/SøknadsSteg/3-VelgBarn/VelgBarn';
import Oppsummering from '../components/SøknadsSteg/4-Oppsummering/Oppsummering';
import Kvittering from '../components/SøknadsSteg/5-Kvittering/Kvittering';
import { ILokasjon } from '../typer/lokasjon';

export interface IRoute {
    path: string;
    label: string;
    route: RouteEnum;
    komponent: React.FC;
}

export enum RouteEnum {
    Forside = 'Forside',
    OmDeg = 'Om deg',
    Søknadstype = 'Søknadstype',
    VelgBarn = 'Velg barn',
    Oppsummering = 'Oppsummering',
    Kvittering = 'Kvittering',
}

export const StegRoutes: IRoute[] = [
    { path: '/', label: 'Forside', route: RouteEnum.OmDeg, komponent: OmDeg },
    { path: '/om-deg', label: 'Om deg', route: RouteEnum.OmDeg, komponent: OmDeg },
    {
        path: '/soknadstype',
        label: 'Søknadstype',
        route: RouteEnum.Søknadstype,
        komponent: Søknadstype,
    },
    { path: '/velg-barn', label: 'Velg barn', route: RouteEnum.VelgBarn, komponent: VelgBarn },
    {
        path: '/oppsummering',
        label: 'Oppsummering',
        route: RouteEnum.Oppsummering,
        komponent: Oppsummering,
    },
    {
        path: '/kvittering',
        label: 'Kvittering',
        route: RouteEnum.Kvittering,
        komponent: Kvittering,
    },
];

export const hentAktivtStegIndex = (location: Location<ILokasjon>) =>
    // Trekker fra 1 fordi forsiden teller som en route
    StegRoutes.findIndex(steg => steg.path === location.pathname) - 1;

export const hentForrigeRoute = (routes: IRoute[], currentPath: string) => {
    const routeIndex = routes.findIndex(route => route.path === currentPath);
    return routes[routeIndex - 1];
};

export const hentNesteRoute = (routes: IRoute[], currentPath: string) => {
    const routeIndex = routes.findIndex(route => route.path === currentPath);
    return routes[routeIndex + 1];
};

export const hentPath = (routes: IRoute[], route: RouteEnum) => {
    return routes.find(r => r.route === route)?.path;
};
