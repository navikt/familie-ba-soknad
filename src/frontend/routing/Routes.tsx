import React from 'react';

import { Location } from 'history';
import { matchPath } from 'react-router';
import slugify from 'slugify';

import Kvittering from '../components/SøknadsSteg/Kvittering/Kvittering';
import OmBarnaDine from '../components/SøknadsSteg/OmBarnaDine/OmBarnaDine';
import OmBarnetUtfyllende from '../components/SøknadsSteg/OmBarnetUtfyllende/OmBarnetUtfyllende';
import OmDeg from '../components/SøknadsSteg/OmDeg/OmDeg';
import Oppsummering from '../components/SøknadsSteg/Oppsummering/Oppsummering';
import VelgBarn from '../components/SøknadsSteg/VelgBarn/VelgBarn';
import { useApp } from '../context/AppContext';
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
    OmBarna = 'Om barna',
    OmBarnetUtfyllende = 'Om Barnet',
    Oppsummering = 'Oppsummering',
    Kvittering = 'Kvittering',
}

export const useRoutes: () => IRoute[] = () => {
    const {
        søknad: { barnInkludertISøknaden },
    } = useApp();
    // En route per barn som er valgt, eller en plassholder hvis ingen er valgt
    const barnRoutes: IRoute[] = barnInkludertISøknaden.length
        ? barnInkludertISøknaden.map(barn => ({
              path: `/barnet/${slugify(barn.navn)}`,
              label: `Om ${barn.navn}`,
              route: RouteEnum.OmBarnetUtfyllende,
              komponent: OmBarnetUtfyllende,
          }))
        : [
              {
                  path: '/barnet/',
                  label: 'Om barnet',
                  route: RouteEnum.OmBarnetUtfyllende,
                  komponent: OmBarnetUtfyllende,
              },
          ];

    return [
        { path: '/', label: 'Forside', route: RouteEnum.OmDeg, komponent: OmDeg },
        { path: '/om-deg', label: 'Om deg', route: RouteEnum.OmDeg, komponent: OmDeg },
        { path: '/velg-barn', label: 'Velg barn', route: RouteEnum.VelgBarn, komponent: VelgBarn },
        { path: '/om-barna', label: 'Om barna', route: RouteEnum.OmBarna, komponent: OmBarnaDine },
        ...barnRoutes,
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
};

const hentRouteIndex = (routes: IRoute[], currentPath: string): number => {
    return routes.findIndex(route => {
        const match = matchPath(currentPath, {
            path: route.path,
            exact: true,
        });
        return match !== null;
    });
};

export const useAktivtStegIndex = (location: Location<ILokasjon>) =>
    // Trekker fra 1 fordi forsiden teller som en route
    hentRouteIndex(useRoutes(), location.pathname) - 1;

export const hentForrigeRoute = (routes: IRoute[], currentPath: string) => {
    const routeIndex = hentRouteIndex(routes, currentPath);
    return routes[routeIndex - 1];
};

export const hentNesteRoute = (routes: IRoute[], currentPath: string) => {
    const routeIndex = hentRouteIndex(routes, currentPath);
    return routes[routeIndex + 1];
};

export const hentPath = (routes: IRoute[], route: RouteEnum) => {
    return routes.find(r => r.route === route)?.path;
};
