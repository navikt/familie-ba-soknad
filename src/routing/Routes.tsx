import Søknadstype from '../components/SøknadsSteg/1-Søknadstype/Søknadstype';
import Steg2 from '../components/SøknadsSteg/2-VelgBarn/Steg2';
import Steg3 from '../components/SøknadsSteg/Steg3/Steg3';
import Steg4 from '../components/SøknadsSteg/Steg4/Steg4';

export interface IStegRoute {
    path: string;
    label: string;
    komponent: React.FC;
}

export const StegRoutes: IStegRoute[] = [
    { path: '/soknadstype', label: 'Søknadstype', komponent: Søknadstype },
    { path: '/velg-barn', label: 'Velg barn', komponent: Steg2 },
    { path: '/steg3', label: 'Steg 3', komponent: Steg3 },
    { path: '/steg4', label: 'Steg 4', komponent: Steg4 },
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
