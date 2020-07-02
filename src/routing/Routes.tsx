export interface IRoute {
    route: RouteEnum;
    path: string;
    label: string;
}

export enum RouteEnum {
    steg1 = 'steg1',
    steg2 = 'steg2',
    steg3 = 'steg3',
    steg4 = 'steg4',
}

export const Routes: IRoute[] = [
    { path: '/steg1', label: 'steg1', route: RouteEnum.steg1 },
    { path: '/steg2', label: 'steg2', route: RouteEnum.steg2 },
    { path: '/steg3', label: 'steg3', route: RouteEnum.steg3 },
    { path: '/steg4', label: 'steg4', route: RouteEnum.steg4 },
];

export const hentPath = (routes: IRoute[], route: RouteEnum) => {
    return routes.find(r => r.route === route)?.path;
};

export const hentForrigeRoute = (routes: IRoute[], currentPath: string) => {
    const routeIndex = routes.findIndex(route => route.path === currentPath);
    const forrigeRoute = routes[routeIndex - 1];
    return forrigeRoute;
};

export const hentNesteRoute = (routes: IRoute[], currentPath: string) => {
    const routeIndex = routes.findIndex(route => route.path === currentPath);
    const nesteRoute = routes[routeIndex + 1];
    return nesteRoute;
};
