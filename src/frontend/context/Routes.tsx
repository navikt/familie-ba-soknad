import { ISteg, RouteEnum } from '../typer/routes';

export const omBarnetBasePath = 'om-barnet';
export const eøsBarnBasePath = 'eøs-barn';

const routes: ISteg[] = [
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
    {
        path: `/${eøsBarnBasePath}/barn-:index`,
        label: `Om EØS barn`,
        route: RouteEnum.EøsForBarn,
    },
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

const hentRouteObjektForRouteEnum = (routeEnum: RouteEnum) =>
    routes.find(route => route.route === routeEnum) ?? routes[0];

export { routes, hentRouteObjektForRouteEnum };
