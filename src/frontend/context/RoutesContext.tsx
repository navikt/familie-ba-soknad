import React, { useState } from 'react';

import createUseContext from 'constate';
import { StegindikatorStegProps } from 'nav-frontend-stegindikator/lib/stegindikator-steg';
import { matchPath } from 'react-router';

import Dokumentasjon from '../components/SøknadsSteg/Dokumentasjon/Dokumentasjon';
import Forside from '../components/SøknadsSteg/Forside/Forside';
import Kvittering from '../components/SøknadsSteg/Kvittering/Kvittering';
import OmBarnaDine from '../components/SøknadsSteg/OmBarnaDine/OmBarnaDine';
import OmBarnet from '../components/SøknadsSteg/OmBarnet/OmBarnet';
import OmDeg from '../components/SøknadsSteg/OmDeg/OmDeg';
import Oppsummering from '../components/SøknadsSteg/Oppsummering/Oppsummering';
import DinLivssituasjon from '../components/SøknadsSteg/Utvidet-DinLivssituasjon/DinLivssituasjon';
import VelgBarn from '../components/SøknadsSteg/VelgBarn/VelgBarn';
import { IBarnMedISøknad } from '../typer/person';
import { useApp } from './AppContext';

export interface IRoute {
    path: string;
    label: string;
    route: RouteEnum;
    komponent: React.FC | React.FC<{ barnetsId: string }>;
    // Vi kan ha routes som ser helt like ut (to barn uten navn f.eks), trenger å kunne skille mellom dem
    spesifisering?: string;
}

export enum RouteEnum {
    Forside = 'Forside',
    OmDeg = 'OmDeg',
    DinLivssituasjon = 'DinLivssituasjon',
    VelgBarn = 'VelgBarn',
    OmBarna = 'OmBarna',
    OmBarnet = 'OmBarnet',
    Oppsummering = 'Oppsummering',
    Dokumentasjon = 'Dokumentasjon',
    Kvittering = 'Kvittering',
}

export const omBarnetBasePath = 'om-barnet';

const [RoutesProvider, useRoutes] = createUseContext(() => {
    const {
        søknad: { barnInkludertISøknaden },
    } = useApp();

    const [barnForRoutes, settBarnForRoutes] = useState<IBarnMedISøknad[]>(barnInkludertISøknaden);

    // Hack for å unngå race-condition mellom redirect og oppdatering av ruter med barn ved bruk av mellomlagret verdi
    const [oppdatertEtterMellomlagring, settOppdatertEtterMellomlagring] = useState(false);

    // En route per barn som er valgt, eller en plassholder hvis ingen er valgt
    const barnRoutes: IRoute[] = barnForRoutes.length
        ? barnForRoutes.map((barn, index) => {
              return {
                  path: `/${omBarnetBasePath}/barn-${index + 1}`,
                  label: `Om ${barn.navn}`,
                  route: RouteEnum.OmBarnet,
                  komponent: () => {
                      return <OmBarnet barnetsId={barn.id} />;
                  },
                  spesifisering: barn.id,
              };
          })
        : [
              {
                  path: `/${omBarnetBasePath}/`,
                  label: 'Om barnet',
                  route: RouteEnum.OmBarnet,
                  komponent: OmBarnet,
              },
          ];

    // TODO: skrive om label til språktekst
    const routes: IRoute[] = [
        { path: '/', label: 'Forside', route: RouteEnum.Forside, komponent: Forside },
        { path: '/om-deg', label: 'Om deg', route: RouteEnum.OmDeg, komponent: OmDeg },
        {
            path: '/din-livssituasjon',
            label: 'Din Livssituasjon',
            route: RouteEnum.DinLivssituasjon,
            komponent: DinLivssituasjon,
        },

        { path: '/velg-barn', label: 'Velg barn', route: RouteEnum.VelgBarn, komponent: VelgBarn },
        { path: '/om-barna', label: 'Om barna', route: RouteEnum.OmBarna, komponent: OmBarnaDine },
        ...barnRoutes,
        {
            path: '/oppsummering',
            label: 'Oppsummering',
            route: RouteEnum.Oppsummering,
            komponent: Oppsummering,
        },
        {
            path: '/dokumentasjon',
            label: 'Dokumentasjon',
            route: RouteEnum.Dokumentasjon,
            komponent: Dokumentasjon,
        },
        {
            path: '/kvittering',
            label: 'Kvittering',
            route: RouteEnum.Kvittering,
            komponent: Kvittering,
        },
    ];

    const hentStegNummer = (route: RouteEnum) => {
        return routes.findIndex(steg => steg.route === route);
    };

    const hentRouteIndex = (currentPath: string): number => {
        const index = routes.findIndex(route => {
            const match = matchPath(currentPath, {
                path: route.path,
                exact: true,
            });
            return match !== null;
        });
        return Math.max(index, 0);
    };

    const erPåKvitteringsside = (currentPath: string): boolean =>
        routes[hentRouteIndex(currentPath)].route === RouteEnum.Kvittering;

    const hentAktivtStegIndexForStegindikator = (currentPath: string) => {
        // Trekker fra 1 fordi forsiden teller som en route
        return hentRouteIndex(currentPath) - 1;
    };

    const hentForrigeRoute = (currentPath: string) => {
        return routes[hentRouteIndex(currentPath) - 1];
    };

    const hentNesteRoute = (currentPath: string) => {
        return routes[hentRouteIndex(currentPath) + 1];
    };

    const hentNåværendeRoute = (currentPath: string) => {
        return routes[hentRouteIndex(currentPath)];
    };

    const hentGjeldendeRoutePåStegindex = (stegIndex: number) => {
        return routes[stegIndex];
    };

    const hentPath = (route: RouteEnum): string => {
        return routes.find(r => r.route === route)?.path ?? '/';
    };

    const hentStegObjekterForStegIndikator = (): StegindikatorStegProps[] => {
        return routes
            .filter(steg => steg.route !== RouteEnum.Forside)
            .map((steg, index) => {
                return {
                    label: steg.label,
                    index: index,
                };
            });
    };

    const hentStegObjektForRoute = (route: RouteEnum): IRoute => {
        return routes.find(steg => steg.route === route) ?? routes[0];
    };

    const hentStegObjektForBarn = (barn: IBarnMedISøknad): IRoute | undefined => {
        return routes.find(route => route.spesifisering === barn.id);
    };

    return {
        hentRouteIndex,
        hentAktivtStegIndexForStegindikator,
        hentForrigeRoute,
        hentNesteRoute,
        hentGjeldendeRoutePåStegindex,
        hentPath,
        hentStegNummer,
        routes,
        settBarnForRoutes,
        oppdatertEtterMellomlagring,
        settOppdatertEtterMellomlagring,
        hentStegObjekterForStegIndikator,
        erPåKvitteringsside,
        hentNåværendeRoute,
        hentStegObjektForRoute,
        hentStegObjektForBarn,
    };
});

export { RoutesProvider, useRoutes };
