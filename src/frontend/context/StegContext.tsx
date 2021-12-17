import { useEffect, useState } from 'react';

import createUseContext from 'constate';
import { StegindikatorStegProps } from 'nav-frontend-stegindikator/lib/stegindikator-steg';
import { matchPath, useLocation } from 'react-router-dom';

import { ISteg, RouteEnum } from '../typer/routes';
import { IBarnMedISøknad } from '../typer/søknad';
import { useApp } from './AppContext';
import { routes } from './Routes';

const [StegProvider, useSteg] = createUseContext(() => {
    const { søknad } = useApp();
    const { barnInkludertISøknaden } = søknad;
    const { pathname: currentLocation } = useLocation();

    const [barnForSteg, settBarnForSteg] = useState<IBarnMedISøknad[]>([]);
    const [barnForEøsSteg, settBarnForEøsSteg] = useState<IBarnMedISøknad[]>([]);

    useEffect(() => {
        settBarnForSteg(søknad.barnInkludertISøknaden);
    }, [søknad.barnInkludertISøknaden]);

    const steg: ISteg[] = routes
        .map((route): ISteg | ISteg[] => {
            const barnRoute = routes.find(route => route.route === RouteEnum.OmBarnet);
            const barnEøsRoute = routes.find(route => route.route === RouteEnum.EøsForBarn);

            switch (route.route) {
                case RouteEnum.OmBarnet:
                    return barnForSteg.map((_barn, index) => ({
                        path:
                            barnRoute?.path.replace(':number', (index + 1) as unknown as string) ??
                            '/',
                        route: RouteEnum.OmBarnet,
                        label: route.label,
                    }));
                case RouteEnum.EøsForBarn:
                    return barnForEøsSteg.map((_barn, index) => ({
                        path:
                            barnEøsRoute?.path.replace(
                                ':number',
                                (index + 1) as unknown as string
                            ) ?? '/',
                        route: RouteEnum.EøsForBarn,
                        label: route.label,
                    }));
                default:
                    return { path: route.path, route: route.route, label: route.label };
            }
        })
        .flat();

    const stegIndikatorObjekter: StegindikatorStegProps[] = steg.map((steg, index) => ({
        label: steg.label,
        index: index,
        key: index,
    }));

    const hentSteg = (location: string): ISteg => {
        const index = steg.findIndex(steg => matchPath(location, { path: steg.path, exact: true }));
        return steg[index] ?? steg[0];
    };

    const hentStegNummer = (route: RouteEnum, barn?: IBarnMedISøknad): number => {
        switch (route) {
            case RouteEnum.OmBarnet:
                const index = barnInkludertISøknaden.findIndex(barnISøknad => barn === barnISøknad);
                return (
                    steg.findIndex(steg => steg.route === RouteEnum.OmBarnet) + Math.max(index, 0)
                );
            default:
                return steg.findIndex(steg => steg.route === route);
        }
    };

    const hentNåværendeSteg = (): ISteg => {
        return hentSteg(currentLocation);
    };

    const hentNesteSteg = (): ISteg => {
        const nåværendeSteg = hentSteg(currentLocation);
        const nåværendeIndex = steg.findIndex(steg => steg === nåværendeSteg);
        return steg[Math.min(nåværendeIndex + 1, steg.length - 1)];
    };

    const hentForrigeSteg = (): ISteg => {
        const nåværendeSteg = hentSteg(currentLocation);
        const nåværendeIndex = steg.findIndex(steg => steg === nåværendeSteg);
        return steg[Math.max(nåværendeIndex - 1, 0)];
    };

    const hentStegObjektForBarn = (barn: IBarnMedISøknad): ISteg => {
        return steg[hentStegNummer(RouteEnum.OmBarnet, barn)];
    };

    const hentNåværendeStegIndex = (): number => {
        return Math.max(
            steg.findIndex(steg => steg === hentNåværendeSteg()),
            0
        );
    };

    const erPåKvitteringsside = () => hentNåværendeSteg().route === RouteEnum.Kvittering;

    return {
        steg,
        stegIndikatorObjekter,
        hentStegNummer,
        hentStegObjektForBarn,
        hentNesteSteg,
        hentNåværendeSteg,
        hentForrigeSteg,
        hentNåværendeStegIndex,
        erPåKvitteringsside,
        settBarnForSteg,
        barnForEøsSteg,
        settBarnForEøsSteg,
    };
});

export { StegProvider, useSteg };
