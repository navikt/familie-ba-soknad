import React, { useState } from 'react';

import createUseContext from 'constate';
import { matchPath } from 'react-router';
import slugify from 'slugify';

import Forside from '../components/Forside/Forside';
import Kvittering from '../components/SøknadsSteg/Kvittering/Kvittering';
import OmBarnaDine from '../components/SøknadsSteg/OmBarnaDine/OmBarnaDine';
import OmBarnetUtfyllende from '../components/SøknadsSteg/OmBarnetUtfyllende/OmBarnetUtfyllende';
import OmDeg from '../components/SøknadsSteg/OmDeg/OmDeg';
import Oppsummering from '../components/SøknadsSteg/Oppsummering/Oppsummering';
import VelgBarn from '../components/SøknadsSteg/VelgBarn/VelgBarn';
import { useApp } from '../context/AppContext';
import { IBarn } from '../typer/person';

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

const [RoutesProvider, useRoutes] = createUseContext(() => {
    const {
        søknad: { barnInkludertISøknaden },
    } = useApp();

    const [barnForRoutes, settBarnForRoutes] = useState<IBarn[]>(barnInkludertISøknaden);

    // En route per barn som er valgt, eller en plassholder hvis ingen er valgt
    const barnRoutes: IRoute[] = barnForRoutes.length
        ? barnForRoutes.map((barn, index) => ({
              path: `/barnet/${slugify(`barn-${index + 1}`)}`,
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

    // TODO: skrive om label til språktekst
    const routes = [
        { path: '/', label: 'Forside', route: RouteEnum.Forside, komponent: Forside },
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

    const hentRouteIndex = (currentPath: string): number => {
        return routes.findIndex(route => {
            const match = matchPath(currentPath, {
                path: route.path,
                exact: true,
            });
            return match !== null;
        });
    };

    const hentAktivtStegIndexForStegindikator = (currentPath: string) => {
        // Trekker fra 1 fordi forsiden teller som en route
        return hentRouteIndex(currentPath) - 1;
    };

    const hentForrigeRoute = (currentPath: string) => {
        return routes[hentRouteIndex(currentPath) - 1];
    };

    const hentNesteRoute = (currentPath: string) => {
        return routes[hentRouteIndex(currentPath) + 1];
    };

    const hentPath = (route: RouteEnum) => {
        return routes.find(r => r.route === route)?.path;
    };

    return {
        hentRouteIndex,
        hentAktivtStegIndexForStegindikator,
        hentForrigeRoute,
        hentNesteRoute,
        hentPath,
        routes,
        settBarnForRoutes,
    };
});

export { RoutesProvider, useRoutes };
