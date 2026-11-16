import { useNavigate } from 'react-router';

import { useAppContext } from '../context/AppContext';
import { useEøsContext } from '../context/EøsContext';
import { useStegContext } from '../context/StegContext';
import { ROUTES } from '../routes';
import { RouteEnum } from '../typer/routes';
import type { ISøknad } from '../typer/søknad';

// Stegene i StegContext er ikke oppdatert før neste rendring, derfor regnes indeksen ut her.
const finnStegindeksForOppsummering = ({ søker, barnInkludertISøknaden }: ISøknad): number => {
    const antallBarnMedEøsSteg = barnInkludertISøknaden.filter(barn => søker.triggetEøs || barn.triggetEøs).length;

    const antallSteg = (route: RouteEnum): number => {
        switch (route) {
            case RouteEnum.OmBarnet:
                return barnInkludertISøknaden.length;
            case RouteEnum.EøsForSøker:
                return søker.triggetEøs || antallBarnMedEøsSteg > 0 ? 1 : 0;
            case RouteEnum.EøsForBarn:
                return antallBarnMedEøsSteg;
            default:
                return 1;
        }
    };

    const ruter = Object.values(ROUTES).map(({ route }) => route);
    return ruter
        .slice(0, ruter.indexOf(RouteEnum.Oppsummering))
        .reduce((antall, route) => antall + antallSteg(route), 0);
};

export function useGåTilOppsummering() {
    const { settSøknad, settSisteUtfylteStegIndex } = useAppContext();
    const { settBarnForSteg } = useStegContext();
    const { settSøkerTriggerEøs, settBarnSomTriggerEøs } = useEøsContext();
    const navigate = useNavigate();

    return (søknad: ISøknad) => {
        settSøknad(søknad);
        settBarnForSteg(søknad.barnInkludertISøknaden);
        settSøkerTriggerEøs(søknad.søker.triggetEøs);
        settBarnSomTriggerEøs(søknad.barnInkludertISøknaden.filter(barn => barn.triggetEøs).map(barn => barn.id));
        settSisteUtfylteStegIndex(finnStegindeksForOppsummering(søknad));
        navigate(ROUTES[RouteEnum.Oppsummering].path);
    };
}
