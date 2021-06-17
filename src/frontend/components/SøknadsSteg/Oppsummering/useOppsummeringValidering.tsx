import { useEffect, useState } from 'react';
import { IRoute, RouteEnum, useRoutes } from '../../../context/RoutesContext';
import { useOmdeg } from '../OmDeg/useOmdeg';
import { useVelgBarn } from '../VelgBarn/useVelgBarn';
import { useOmBarnaDine } from '../OmBarnaDine/useOmBarnaDine';
import { useApp } from '../../../context/AppContext';
import { useOmBarnet } from '../OmBarnet/useOmBarnet';

export const useOppsummeringValidering = (): { ugyldigeSteg: IRoute[] } => {

    const { søknad: { barnInkludertISøknaden } } = useApp();
    const { hentStegObjektForRoute, hentStegObjektForBarn } = useRoutes();
    const omDeg = useOmdeg();
    const velgBarn = useVelgBarn();
    const omBarnaDine = useOmBarnaDine();
    const omBarnetSkjemaer = barnInkludertISøknaden.map(barn => useOmBarnet(barn.ident));

    const [ugyldigeSteg, settUgyldigeSteg] = useState<IRoute[]>([]);

    /**
     * Trigg validering av alle felter i alle skjemaer. Dette trigger state updates, som vi lytter
     * på i påfølgende useEffect for å finne hvilke skjemaer som er ugyldige
     */
    omDeg.validerAlleSynligeFelter();
    velgBarn.validerAlleSynligeFelter();
    omBarnaDine.validerAlleSynligeFelter();
    omBarnetSkjemaer.map(skjema => skjema.validerAlleSynligeFelter());

    useEffect(() => {
        const nyeUgyldigeSteg: IRoute[] = [];
        !omDeg.valideringErOk() && nyeUgyldigeSteg.push(hentStegObjektForRoute(RouteEnum.OmDeg));
        !velgBarn.valideringErOk() && nyeUgyldigeSteg.push(hentStegObjektForRoute(RouteEnum.VelgBarn));
        !omBarnaDine.valideringErOk() && nyeUgyldigeSteg.push(hentStegObjektForRoute(RouteEnum.OmBarna));

        omBarnetSkjemaer.forEach(skjema => {
            const route = skjema.barn && hentStegObjektForBarn(skjema.barn);
            !skjema.valideringErOk() && route && nyeUgyldigeSteg.push(route);
        });

        nyeUgyldigeSteg.length !== ugyldigeSteg.length && settUgyldigeSteg(nyeUgyldigeSteg);

    }, [omDeg, velgBarn, omBarnaDine, omBarnetSkjemaer]);

    return { ugyldigeSteg };
}
