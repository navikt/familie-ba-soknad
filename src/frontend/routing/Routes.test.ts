import * as appContext from '../context/AppContext';
import { useRoutes, hentNesteRoute, RouteEnum, hentForrigeRoute } from './Routes';

jest.mock('../context/AppContext');
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: '/barnet/Jens',
    }),
}));

const spyOnUseApp = søknad => {
    jest.spyOn(appContext, 'useApp').mockImplementation(jest.fn().mockReturnValue({ søknad }));
};

test(`Kan hente routes før barn er valgt`, () => {
    spyOnUseApp({
        barnInkludertISøknaden: [],
    });
    const routes = useRoutes();
    expect(routes.length).toEqual(7);
});

test(`Kan hente neste route fra forsiden`, () => {
    spyOnUseApp({
        barnInkludertISøknaden: [
            {
                navn: 'Jens',
            },
        ],
    });
    const location = '/';
    const nesteRoute = hentNesteRoute(useRoutes(), location);
    expect(nesteRoute.route).toBe(RouteEnum.OmDeg);
});

test(`Kan hente neste route når inneværende route er eneste barn`, () => {
    spyOnUseApp({
        barnInkludertISøknaden: [
            {
                navn: 'Jens',
            },
        ],
    });
    const location = '/barnet/Jens';
    const nesteRoute = hentNesteRoute(useRoutes(), location);
    expect(nesteRoute.route).toBe(RouteEnum.Oppsummering);
});

test(`Kan hente forrige route når inneværende route er eneste barn`, () => {
    spyOnUseApp({
        barnInkludertISøknaden: [
            {
                navn: 'Jens',
            },
        ],
    });
    const location = '/barnet/Jens';
    const nesteRoute = hentForrigeRoute(useRoutes(), location);
    expect(nesteRoute.route).toBe(RouteEnum.OmBarna);
});

test(`Label til steg om barnet skal inneholde barnets navn`, () => {
    spyOnUseApp({
        barnInkludertISøknaden: [
            {
                navn: 'Jens',
            },
        ],
    });
    const route = useRoutes()[4];
    const label = route.label;
    expect(label).toEqual('Om Jens');
});

test(`Kan navigere mellom steg for utfyllende info om flere barn`, () => {
    spyOnUseApp({
        barnInkludertISøknaden: [
            {
                navn: 'Jens',
            },
            {
                navn: 'Line',
            },
        ],
    });
    const routes = useRoutes();
    const forrigeRouteFraJens = hentForrigeRoute(routes, '/barnet/Jens');
    const forrigeRouteFraLine = hentForrigeRoute(routes, '/barnet/Line');
    const nesteRouteFraJens = hentNesteRoute(routes, '/barnet/Jens');
    const nesteRouteFraLine = hentNesteRoute(routes, '/barnet/Line');

    expect(forrigeRouteFraJens.route).toBe(RouteEnum.OmBarna);
    expect(nesteRouteFraJens.label).toBe('Om Line');
    expect(forrigeRouteFraLine.label).toBe('Om Jens');
    expect(nesteRouteFraLine.route).toBe(RouteEnum.Oppsummering);
});
