import createUseContext from 'constate';

import { EFeatureToggle } from '../typer/feature-toggles';
import { IRoute, RouteEnum } from '../typer/routes';
import { useFeatureToggles } from './FeatureToggleContext';

export const omBarnetBasePath = 'om-barnet';
export const eøsBarnBasePath = 'eøs-barn';

export const getRoutes = (brukEøsKomplett: boolean | undefined) => {
    return [
        { path: '/', label: 'Forside', route: RouteEnum.Forside },
        { path: '/om-deg', label: 'Om deg', route: RouteEnum.OmDeg },
        {
            path: '/din-livssituasjon',
            label: 'Din Livssituasjon',
            route: RouteEnum.DinLivssituasjon,
        },
        { path: '/velg-barn', label: 'Velg barn', route: RouteEnum.VelgBarn },
        { path: '/om-barna', label: 'Om barna', route: RouteEnum.OmBarna },
        {
            path: `/${omBarnetBasePath}/barn-:number`,
            label: `Om barnet`,
            route: RouteEnum.OmBarnet,
        },
        ...(brukEøsKomplett
            ? [
                  {
                      path: '/eøs-søker',
                      label: 'Eøs søker',
                      route: RouteEnum.EøsForSøker,
                  },
              ]
            : []),
        ...(brukEøsKomplett
            ? [
                  {
                      path: `/${eøsBarnBasePath}/barn-:number`,
                      label: `Om EØS barn`,
                      route: RouteEnum.EøsForBarn,
                  },
              ]
            : []),
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
};

const [RoutesProvider, useRoutes] = createUseContext(() => {
    const { toggles } = useFeatureToggles();

    const routes = getRoutes(toggles[EFeatureToggle.EØS_KOMPLETT]);
    const hentRouteObjektForRouteEnum = (routeEnum: RouteEnum) =>
        routes.find(route => route.route === routeEnum) ?? routes[0];

    return { routes, hentRouteObjektForRouteEnum };
});

export { RoutesProvider, useRoutes };
