import { ESvar } from '@navikt/familie-form-elements';

import { IBarnMedISøknad, ISøknad } from '../typer/søknad';

export const landSvarSomKanTriggeEøs = (søknad: ISøknad) => {
    const fraOmDeg = [
        søknad.søker.oppholdsland.svar,
        søknad.søker.arbeidsland.svar,
        søknad.søker.pensjonsland.svar,
    ];
    const fraOmBarnet = søknad.barnInkludertISøknaden.flatMap((barn: IBarnMedISøknad) => [
        barn.oppholdsland.svar,
        barn.barnetrygdFraEøslandHvilketLand.svar,
        barn.andreForelderArbeidUtlandetHvilketLand.svar,
        barn.andreForelderPensjonHvilketLand.svar,
    ]);
    return fraOmDeg.concat(fraOmBarnet);
};

export const jaNeiSvarTriggerEøs = (søknad: ISøknad) =>
    søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar === ESvar.JA;
