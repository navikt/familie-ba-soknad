import Søknadstype from '../components/SøknadsSteg/1-Søknadstype/Søknadstype';
import VelgBarn from '../components/SøknadsSteg/2-VelgBarn/VelgBarn';
import Oppsummering from '../components/SøknadsSteg/3-Oppsummering/Oppsummering';
import Kvittering from '../components/SøknadsSteg/4-Kvittering/Kvittering';

export interface IStegRoute {
    path: string;
    label: string;
    route: RouteEnum;
    komponent: React.FC;
}

export enum RouteEnum {
    Søknadstype = 'Søknadstype',
    VelgBarn = 'Velg barn',
    Oppsummering = 'Oppsummering',
    Kvittering = 'Kvittering',
}

export const StegRoutes: IStegRoute[] = [
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
