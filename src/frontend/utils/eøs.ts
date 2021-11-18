import { ESvar } from '@navikt/familie-form-elements';

import { IBarnMedISøknad, ISøknad } from '../typer/søknad';

export const landSvarSomKanTriggeEøs = (søknad: ISøknad) => {
    const fraOmDeg = [
        søknad.søker.arbeidsland.svar,
        søknad.søker.pensjonsland.svar,
        søknad.søker.utenlandsperioder.map(periode => periode.oppholdsland.svar),
    ].flat();

    const fraOmBarnet = søknad.barnInkludertISøknaden
        .flatMap((barn: IBarnMedISøknad) => [
            barn.barnetrygdFraEøslandHvilketLand.svar,
            barn.andreForelderArbeidUtlandetHvilketLand.svar,
            barn.andreForelderPensjonHvilketLand.svar,
            barn.utenlandsperioder.map(periode => periode.oppholdsland.svar),
        ])
        .flat();
    return fraOmDeg.concat(fraOmBarnet);
};

export const jaNeiSvarTriggerEøs = (søknad: ISøknad) =>
    søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar === ESvar.JA;
