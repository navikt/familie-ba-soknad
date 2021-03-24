import React from 'react';

import { Location } from 'history';

import Kvittering from '../components/SøknadsSteg/Kvittering/Kvittering';
import OmDeg from '../components/SøknadsSteg/OmDeg/OmDeg';
import Oppsummering from '../components/SøknadsSteg/Oppsummering/Oppsummering';
import VelgBarn from '../components/SøknadsSteg/VelgBarn/VelgBarn';
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
    VelgBarn = 'Velg barn',
    Oppsummering = 'Oppsummering',
    Kvittering = 'Kvittering',
}

export const Routes: IRoute[] = [
    { path: '/', label: 'Forside', route: RouteEnum.OmDeg, komponent: OmDeg },
    { path: '/om-deg', label: 'Om deg', route: RouteEnum.OmDeg, komponent: OmDeg },
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
    Routes.findIndex(steg => steg.path === location.pathname) - 1;

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
