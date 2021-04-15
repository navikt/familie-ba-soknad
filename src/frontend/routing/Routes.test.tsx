import React from 'react';

import { renderHook } from '@testing-library/react-hooks';

import { spyOnUseApp } from '../utils/testing';
import { useRoutes, RouteEnum, RoutesProvider } from './RoutesContext';

jest.mock('../context/AppContext');
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: '/barnet/Jens',
    }),
}));

describe('Routes', () => {
    test(`Kan hente routes før barn er valgt`, () => {
        spyOnUseApp({
            barnInkludertISøknaden: [],
        });
        const wrapper = ({ children }) => <RoutesProvider>{children}</RoutesProvider>;
        const { result } = renderHook(() => useRoutes(), { wrapper });
        expect(result.current.routes.length).toEqual(7);
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
        const wrapper = ({ children }) => <RoutesProvider>{children}</RoutesProvider>;
        const { result } = renderHook(() => useRoutes(), { wrapper });
        const nesteRoute = result.current.hentNesteRoute(location);
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
        const location = '/barnet/barn-1';
        const wrapper = ({ children }) => <RoutesProvider>{children}</RoutesProvider>;
        const { result } = renderHook(() => useRoutes(), { wrapper });
        const nesteRoute = result.current.hentNesteRoute(location);
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
        const location = '/barnet/barn-1';
        const wrapper = ({ children }) => <RoutesProvider>{children}</RoutesProvider>;
        const { result } = renderHook(() => useRoutes(), { wrapper });
        const nesteRoute = result.current.hentForrigeRoute(location);
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

        const wrapper = ({ children }) => <RoutesProvider>{children}</RoutesProvider>;
        const { result } = renderHook(() => useRoutes(), { wrapper });

        const route = result.current.routes[4];
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
        const wrapper = ({ children }) => <RoutesProvider>{children}</RoutesProvider>;
        const { result } = renderHook(() => useRoutes(), { wrapper });
        const {
            current: { hentForrigeRoute, hentNesteRoute },
        } = result;
        const forrigeRouteFraJens = hentForrigeRoute('/barnet/barn-1');
        const forrigeRouteFraLine = hentForrigeRoute('/barnet/barn-2');
        const nesteRouteFraJens = hentNesteRoute('/barnet/barn-1');
        const nesteRouteFraLine = hentNesteRoute('/barnet/barn-2');

        expect(forrigeRouteFraJens.route).toBe(RouteEnum.OmBarna);
        expect(nesteRouteFraJens.label).toBe('Om Line');
        expect(forrigeRouteFraLine.label).toBe('Om Jens');
        expect(nesteRouteFraLine.route).toBe(RouteEnum.Oppsummering);
    });
});
