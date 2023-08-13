import React from 'react';

import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { RouteEnum } from '../typer/routes';
import { mockEøs, mockFeatureToggle, mockHistory, spyOnUseApp } from '../utils/testing';

import { RoutesProvider } from './RoutesContext';
import { StegProvider, useSteg } from './StegContext';

describe('Steg', () => {
    beforeEach(() => {
        mockFeatureToggle();
        mockEøs();
    });
    test(`Kan hente steg før barn er valgt`, () => {
        spyOnUseApp({
            barnInkludertISøknaden: [],
        });

        const wrapper = ({ children }) => (
            <RoutesProvider>
                <MemoryRouter initialEntries={['/om-barnet/barn/1']}>
                    <StegProvider>{children}</StegProvider>
                </MemoryRouter>
            </RoutesProvider>
        );
        const { result } = renderHook(() => useSteg(), { wrapper });
        expect(result.current.steg.length).toEqual(9);
    });

    test(`stepperObjekter skal returnere en liste uten forside`, () => {
        spyOnUseApp({
            barnInkludertISøknaden: [],
        });
        const wrapper = ({ children }) => (
            <RoutesProvider>
                <MemoryRouter initialEntries={['/om-barnet/barn/1']}>
                    <StegProvider>{children}</StegProvider>
                </MemoryRouter>
            </RoutesProvider>
        );
        const { result } = renderHook(() => useSteg(), { wrapper });
        expect(result.current.stepperObjekter.length).toEqual(8);
    });

    test(`Kan hente neste steg fra forsiden`, () => {
        spyOnUseApp({
            barnInkludertISøknaden: [
                {
                    navn: 'Jens',
                },
            ],
        });

        const wrapper = ({ children }) => (
            <RoutesProvider>
                <MemoryRouter initialEntries={['/']}>
                    <StegProvider>{children}</StegProvider>
                </MemoryRouter>
            </RoutesProvider>
        );
        const { result } = renderHook(() => useSteg(), { wrapper });
        const nesteSteg = result.current.hentNesteSteg();
        expect(nesteSteg.route).toBe(RouteEnum.OmDeg);
    });

    test(`Kan hente neste steg når inneværende route er eneste barn`, () => {
        spyOnUseApp({
            barnInkludertISøknaden: [
                {
                    navn: 'Jens',
                },
            ],
        });

        const wrapper = ({ children }) => (
            <RoutesProvider>
                <MemoryRouter initialEntries={['/om-barnet/barn/1']}>
                    <StegProvider>{children}</StegProvider>
                </MemoryRouter>
            </RoutesProvider>
        );
        const { result } = renderHook(() => useSteg(), { wrapper });
        const nesteRoute = result.current.hentNesteSteg();
        expect(nesteRoute.route).toBe(RouteEnum.Oppsummering);
    });

    test(`Kan hente forrige steg når inneværende steg er eneste barn`, () => {
        spyOnUseApp({
            barnInkludertISøknaden: [
                {
                    navn: 'Jens',
                },
            ],
        });

        const wrapper = ({ children }) => (
            <RoutesProvider>
                <MemoryRouter initialEntries={['/om-barnet/barn/1']}>
                    <StegProvider>{children}</StegProvider>
                </MemoryRouter>
            </RoutesProvider>
        );
        const { result } = renderHook(() => useSteg(), { wrapper });
        const nesteRoute = result.current.hentNesteSteg();
        expect(nesteRoute.route).toBe(RouteEnum.Oppsummering);
    });

    test(`Label til steg om barnet skal inneholde barnets navn`, () => {
        spyOnUseApp({
            barnInkludertISøknaden: [
                {
                    navn: 'Jens',
                },
            ],
        });

        const wrapper = ({ children }) => (
            <RoutesProvider>
                <MemoryRouter initialEntries={['/om-barnet/barn/1']}>
                    <StegProvider>{children}</StegProvider>
                </MemoryRouter>
            </RoutesProvider>
        );
        const { result } = renderHook(() => useSteg(), { wrapper });

        const route = result.current.steg[5];
        const label = route.label;
        expect(label).toEqual('Om barnet');
    });

    test(`Kan navigere til om-barna og barn/2 dersom det er to barn`, () => {
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
        const wrapper = ({ children }) => (
            <RoutesProvider>
                <MemoryRouter initialEntries={['/om-barnet/barn/1']}>
                    <StegProvider>{children}</StegProvider>
                </MemoryRouter>
            </RoutesProvider>
        );

        const { result } = renderHook(() => useSteg(), { wrapper });

        expect(result.current.hentForrigeSteg().path).toBe('/om-barna');
        expect(result.current.hentNesteSteg().path).toBe('/om-barnet/barn/2');
    });

    test(`Kan navigere mellom tilbake til barn/1 eller til oppsummering dersom det er to barn`, () => {
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
        const wrapper = ({ children }) => (
            <RoutesProvider>
                <MemoryRouter initialEntries={['/om-barnet/barn/1', '/om-barnet/barn/2']}>
                    <StegProvider>{children}</StegProvider>
                </MemoryRouter>
            </RoutesProvider>
        );

        const { result } = renderHook(() => useSteg(), { wrapper });

        expect(result.current.hentForrigeSteg().path).toBe('/om-barnet/barn/1');
        expect(result.current.hentNesteSteg().path).toBe('/oppsummering');
    });
});
