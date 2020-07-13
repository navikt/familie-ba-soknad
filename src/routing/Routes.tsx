import Søknadstype from '../components/SøknadsSteg/1-Søknadstype/Søknadstype';
import Steg2 from '../components/SøknadsSteg/Steg2/Steg2';
import Steg3 from '../components/SøknadsSteg/Steg3/Steg3';
import Oppsummering from '../components/SøknadsSteg/4-Oppsummering/Oppsummering';

export interface IStegRoute {
    path: string;
    label: string;
    route: RouteEnum;
    komponent: React.FC;
}

export enum RouteEnum {
    Søknadstype = 'Søknadstype',
    Steg2 = 'Steg2',
    Steg3 = 'Steg3',
    Oppsummering = 'Oppsummering',
}

export const StegRoutes: IStegRoute[] = [
    {
        path: '/soknadstype',
        label: 'Søknadstype',
        route: RouteEnum.Søknadstype,
        komponent: Søknadstype,
    },
    { path: '/steg2', label: 'Steg 2', route: RouteEnum.Steg2, komponent: Steg2 },
    { path: '/steg3', label: 'Steg 3', route: RouteEnum.Steg3, komponent: Steg3 },
    {
        path: '/oppsummering',
        label: 'Oppsummering',
        route: RouteEnum.Oppsummering,
        komponent: Oppsummering,
    },
];

export const hentForrigeRoute = (routes: IStegRoute[], currentPath: string) => {
    const routeIndex = routes.findIndex(route => route.path === currentPath);
    const forrigeRoute = routes[routeIndex - 1];
    return forrigeRoute;
};

export const hentNesteRoute = (routes: IStegRoute[], currentPath: string) => {
    const routeIndex = routes.findIndex(route => route.path === currentPath);
    const nesteRoute = routes[routeIndex + 1];
    return nesteRoute;
};

export const hentPath = (routes: IStegRoute[], route: RouteEnum) => {
    return routes.find(r => r.route === route)?.path;
};
