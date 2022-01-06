import React from 'react';

import { renderHook } from '@testing-library/react-hooks';

import { RoutesProvider } from '../context/RoutesContext';
import { RouteEnum } from '../typer/routes';
import { mockFeatureToggle, mockHistory, spyOnUseApp } from '../utils/testing';
import { StegProvider, useSteg } from './StegContext';

mockHistory(['/om-barnet/barn-1']);

describe('Steg', () => {
    test(`Kan hente routes før barn er valgt`, () => {
        spyOnUseApp({
            barnInkludertISøknaden: [],
        });
        mockFeatureToggle();

        const wrapper = ({ children }) => (
            <RoutesProvider>
                <StegProvider>{children}</StegProvider>
            </RoutesProvider>
        );
        const { result } = renderHook(() => useSteg(), { wrapper });
        expect(result.current.steg.length).toEqual(9);
    });

    test(`hentStegObjekterForStegIndikator skal returnere en liste uten forside`, () => {
        spyOnUseApp({
            barnInkludertISøknaden: [],
        });
        mockFeatureToggle();
        const wrapper = ({ children }) => (
            <RoutesProvider>
                <StegProvider>{children}</StegProvider>
            </RoutesProvider>
        );
        const { result } = renderHook(() => useSteg(), { wrapper });
        expect(result.current.stegIndikatorObjekter.length).toEqual(8);
    });

    test(`Kan hente neste route fra forsiden`, () => {
        spyOnUseApp({
            barnInkludertISøknaden: [
                {
                    navn: 'Jens',
                },
            ],
        });
        mockFeatureToggle();
        mockHistory(['/']);
        const wrapper = ({ children }) => (
            <RoutesProvider>
                <StegProvider>{children}</StegProvider>
            </RoutesProvider>
        );
        const { result } = renderHook(() => useSteg(), { wrapper });
        const nesteSteg = result.current.hentNesteSteg();
        expect(nesteSteg.route).toBe(RouteEnum.OmDeg);
    });

    test(`Kan hente neste route når inneværende route er eneste barn`, () => {
        spyOnUseApp({
            barnInkludertISøknaden: [
                {
                    navn: 'Jens',
                },
            ],
        });
        mockHistory(['/om-barnet/barn-1']);
        mockFeatureToggle();
        const wrapper = ({ children }) => (
            <RoutesProvider>
                <StegProvider>{children}</StegProvider>
            </RoutesProvider>
        );
        const { result } = renderHook(() => useSteg(), { wrapper });
        const nesteRoute = result.current.hentNesteSteg();
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
        mockHistory(['/om-barnet/barn-1']);
        mockFeatureToggle();
        const wrapper = ({ children }) => (
            <RoutesProvider>
                <StegProvider>{children}</StegProvider>
            </RoutesProvider>
        );
        const { result } = renderHook(() => useSteg(), { wrapper });
        const nesteRoute = result.current.hentNesteSteg();
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
        mockFeatureToggle();

        const wrapper = ({ children }) => (
            <RoutesProvider>
                <StegProvider>{children}</StegProvider>
            </RoutesProvider>
        );
        const { result } = renderHook(() => useSteg(), { wrapper });

        const route = result.current.steg[5];
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
        mockFeatureToggle();
        const wrapper = ({ children }) => (
            <RoutesProvider>
                <StegProvider>{children}</StegProvider>
            </RoutesProvider>
        );
        const { result } = renderHook(() => useSteg(), { wrapper });
        const {
            current: { hentForrigeSteg, hentNesteSteg },
        } = result;
        mockHistory(['/om-barnet/barn-1']);
        const forrigeRouteFraJens = hentForrigeSteg();
        mockHistory(['/om-barnet/barn-2']);
        const forrigeRouteFraLine = hentForrigeSteg();
        mockHistory(['/om-barnet/barn-1']);
        const nesteRouteFraJens = hentNesteSteg();
        mockHistory(['/om-barnet/barn-2']);
        const nesteRouteFraLine = hentNesteSteg();

        expect(forrigeRouteFraJens.route).toBe(RouteEnum.OmBarna);
        expect(nesteRouteFraJens.label).toBe('Om Line');
        expect(forrigeRouteFraLine.label).toBe('Om Jens');
        expect(nesteRouteFraLine.route).toBe(RouteEnum.Oppsummering);
    });
});
