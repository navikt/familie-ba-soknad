import Søknadstype from '../components/SøknadsSteg/1-Søknadstype/Søknadstype';
import Steg2 from '../components/SøknadsSteg/Steg2/Steg2';
import Steg3 from '../components/SøknadsSteg/Steg3/Steg3';
import Oppsummering from '../components/SøknadsSteg/4-Oppsummering/Oppsummering';

export interface IStegRoute {
    path: string;
    label: string;
    komponent: React.FC;
}

export const StegRoutes: IStegRoute[] = [
    { path: '/soknadstype', label: 'Søknadstype', komponent: Søknadstype },
    { path: '/steg2', label: 'Steg 2', komponent: Steg2 },
    { path: '/steg3', label: 'Steg 3', komponent: Steg3 },
    { path: '/oppsummering', label: 'Oppsummering', komponent: Oppsummering },
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
