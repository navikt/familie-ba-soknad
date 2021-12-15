import { useState } from 'react';

import createUseContext from 'constate';
import { StegindikatorStegProps } from 'nav-frontend-stegindikator/lib/stegindikator-steg';
import { matchPath } from 'react-router';

import { IRoute, RouteEnum } from '../typer/routes';
import { IBarnMedISøknad } from '../typer/søknad';
import { useApp } from './AppContext';

export const omBarnetBasePath = 'om-barnet';
export const eøsBarnBasePath = 'eøs-barn';

const [RoutesProvider, useRoutes] = createUseContext(() => {
    const { søknad } = useApp();
    const { barnInkludertISøknaden, søker } = søknad;

    const [barnForRoutes, settBarnForRoutes] = useState<IBarnMedISøknad[]>(barnInkludertISøknaden);

    // Hack for å unngå race-condition mellom redirect og oppdatering av ruter med barn ved bruk av mellomlagret verdi
    const [oppdatertEtterMellomlagring, settOppdatertEtterMellomlagring] = useState(false);

    // En route per barn som er valgt, eller en plassholder hvis ingen er valgt
    const barnRoutes: IRoute[] = barnForRoutes.length
        ? barnForRoutes.map((barn, index): IRoute => {
              return {
                  path: `/${omBarnetBasePath}/barn-${index + 1}`,
                  label: `Om ${barn.navn}`,
                  route: RouteEnum.OmBarnet,
                  spesifisering: barn.id,
              };
          })
        : [
              {
                  path: `/${omBarnetBasePath}/`,
                  label: 'Om barnet',
                  route: RouteEnum.OmBarnet,
              },
          ];

    const eøsRoutesForBarn = () => {
        console.log('eøsrouteforbarn');
        const barnSomSkalHaEøsRoute = søker.triggetEøs
            ? barnForRoutes
            : barnForRoutes.filter(barn => barn.triggetEøs);
        return barnSomSkalHaEøsRoute.map(
            (barn, index): IRoute => ({
                path: `/${eøsBarnBasePath}/barn-${index + 1}`,
                label: `Om EØS ${barn.navn}`,
                route: RouteEnum.EøsForBarn,
                spesifisering: barn.id,
            })
        );
    };

    const eøsRoutes = () => {
        //TODO: fjerne sjekk på environment når vi går live med eøs
        if (process.env.NODE_ENV !== 'development') {
            return [];
        }

        const routesForBarn = eøsRoutesForBarn();
        const routeForSøker =
            søker.triggetEøs || routesForBarn.length
                ? [
                      {
                          path: `/søker-eos`,
                          label: `Om deg EØS`,
                          route: RouteEnum.EøsForSøker,
                      },
                  ]
                : [];
        return routeForSøker.concat(routesForBarn);
    };

    // TODO: skrive om label til språktekst
    const routes: IRoute[] = [
        { path: '/', label: 'Forside', route: RouteEnum.Forside },
        { path: '/om-deg', label: 'Om deg', route: RouteEnum.OmDeg },
        {
            path: '/din-livssituasjon',
            label: 'Din Livssituasjon',
            route: RouteEnum.DinLivssituasjon,
        },

        { path: '/velg-barn', label: 'Velg barn', route: RouteEnum.VelgBarn },
        { path: '/om-barna', label: 'Om barna', route: RouteEnum.OmBarna },
        ...barnRoutes,
        ...eøsRoutes(),
        {
            path: '/oppsummering',
            label: 'Oppsummering',
            route: RouteEnum.Oppsummering,
        },
        {
            path: '/dokumentasjon',
            label: 'Dokumentasjon',
            route: RouteEnum.Dokumentasjon,
        },
        {
            path: '/kvittering',
            label: 'Kvittering',
            route: RouteEnum.Kvittering,
        },
    ];

    const hentStegNummer = (route: RouteEnum) => {
        return routes.findIndex(steg => steg.route === route);
    };

    const hentRouteIndex = (currentPath: string): number => {
        const index = routes.findIndex(route => {
            const match = matchPath(currentPath, {
                path: route.path,
                exact: true,
            });
            return match !== null;
        });
        return Math.max(index, 0);
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

    const hentNåværendeRoute = (currentPath: string) => {
        return routes[hentRouteIndex(currentPath)];
    };

    const hentGjeldendeRoutePåStegindex = (stegIndex: number) => {
        return routes[stegIndex];
    };

    const hentPath = (route: RouteEnum): string => {
        return routes.find(r => r.route === route)?.path ?? '/';
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

    const hentStegObjektForRoute = (route: RouteEnum): IRoute => {
        return routes.find(steg => steg.route === route) ?? routes[0];
    };

    const hentStegObjektForBarn = (barn: IBarnMedISøknad): IRoute | undefined => {
        return routes.find(route => route.spesifisering === barn.id);
    };

    return {
        hentRouteIndex,
        hentAktivtStegIndexForStegindikator,
        hentForrigeRoute,
        hentNesteRoute,
        hentGjeldendeRoutePåStegindex,
        hentPath,
        hentStegNummer,
        routes,
        settBarnForRoutes,
        oppdatertEtterMellomlagring,
        settOppdatertEtterMellomlagring,
        hentStegObjekterForStegIndikator,
        erPåKvitteringsside,
        hentNåværendeRoute,
        hentStegObjektForRoute,
        hentStegObjektForBarn,
    };
});

export { RoutesProvider, useRoutes };
