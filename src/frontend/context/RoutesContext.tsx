import React, { useState } from 'react';

import createUseContext from 'constate';
import { StegindikatorStegProps } from 'nav-frontend-stegindikator/lib/stegindikator-steg';
import { matchPath } from 'react-router';

import Forside from '../components/SøknadsSteg/Forside/Forside';
import Kvittering from '../components/SøknadsSteg/Kvittering/Kvittering';
import OmBarnaDine from '../components/SøknadsSteg/OmBarnaDine/OmBarnaDine';
import OmBarnet from '../components/SøknadsSteg/OmBarnet/OmBarnet';
import OmDeg from '../components/SøknadsSteg/OmDeg/OmDeg';
import Oppsummering from '../components/SøknadsSteg/Oppsummering/Oppsummering';
import VelgBarn from '../components/SøknadsSteg/VelgBarn/VelgBarn';
import { IBarnMedISøknad } from '../typer/person';
import { useApp } from './AppContext';

export interface IRoute {
    path: string;
    label: string;
    route: RouteEnum;
    komponent: React.FC | React.FC<{ barnetsIdent: string }>;
}

export enum RouteEnum {
    Forside = 'Forside',
    OmDeg = 'Om deg',
    VelgBarn = 'Velg barn',
    OmBarna = 'Om barna',
    OmBarnet = 'Om Barnet',
    Oppsummering = 'Oppsummering',
    Kvittering = 'Kvittering',
}

export const omBarnetBasePath = 'om-barnet';

const [RoutesProvider, useRoutes] = createUseContext(() => {
    const {
        søknad: { barnInkludertISøknaden },
    } = useApp();

    const [barnForRoutes, settBarnForRoutes] = useState<IBarnMedISøknad[]>(barnInkludertISøknaden);

    // En route per barn som er valgt, eller en plassholder hvis ingen er valgt
    const barnRoutes: IRoute[] = barnForRoutes.length
        ? barnForRoutes.map((barn, index) => {
              return {
                  path: `/${omBarnetBasePath}/barn-${index + 1}`,
                  label: `Om ${barn.navn}`,
                  route: RouteEnum.OmBarnet,
                  komponent: () => {
                      return <OmBarnet barnetsIdent={barn.ident} />;
                  },
              };
          })
        : [
              {
                  path: `/${omBarnetBasePath}/`,
                  label: 'Om barnet',
                  route: RouteEnum.OmBarnet,
                  komponent: OmBarnet,
              },
          ];

    // TODO: skrive om label til språktekst
    const routes: IRoute[] = [
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
    const hentStegNummer = (route: RouteEnum) => {
        return routes.findIndex(steg => steg.route === route);
    };

    const hentRouteIndex = (currentPath: string): number => {
        return routes.findIndex(route => {
            const match = matchPath(currentPath, {
                path: route.path,
                exact: true,
            });
            return match !== null;
        });
    };

    const erPåKvitteringsside = (currentPath: string): boolean =>
        routes[hentRouteIndex(currentPath)].route === RouteEnum.Kvittering;

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

    const hentStegObjekterForStegIndikator = (): StegindikatorStegProps[] => {
        return routes
            .filter(steg => steg.route !== RouteEnum.Forside)
            .map((steg, index) => {
                return {
                    label: steg.label,
                    index: index,
                };
            });
    };

    return {
        hentRouteIndex,
        hentAktivtStegIndexForStegindikator,
        hentForrigeRoute,
        hentNesteRoute,
        hentPath,
        hentStegNummer,
        routes,
        settBarnForRoutes,
        hentStegObjekterForStegIndikator,
        erPåKvitteringsside,
    };
});

export { RoutesProvider, useRoutes };
