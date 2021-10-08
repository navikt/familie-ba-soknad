import { ESvar } from '@navikt/familie-form-elements';

import { IBarnMedISøknad } from '../typer/person';
import { ISøknad } from '../typer/søknad';

export const landSvarSomKanTriggeEøs = (søknad: ISøknad) => {
    const fraOmDeg = [
        søknad.søker.oppholdsland.svar,
        søknad.søker.arbeidsland.svar,
        søknad.søker.pensjonsland.svar,
    ];
    const fraOmBarnet = søknad.barnInkludertISøknaden.flatMap((barn: IBarnMedISøknad) => [
        barn.oppholdsland.svar,
        barn.barnetrygdFraEøslandHvilketLand.svar,
    ]);
    return fraOmDeg.concat(fraOmBarnet);
};

export const jaNeiSvarTriggerEøs = (søknad: ISøknad) =>
    søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar === ESvar.JA;
