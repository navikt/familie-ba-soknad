import { ESvar } from '@navikt/familie-form-elements';

import { andreForelderDataKeySpørsmål } from '../typer/person';
import { IBarnMedISøknad, ISøknad } from '../typer/søknad';

//TODO fjern og skriv om tester
export const landSvarSomKanTriggeEøs = (søknad: ISøknad) => {
    const fraOmDeg = [
        søknad.søker.arbeidsland.svar,
        søknad.søker.pensjonsland.svar,
        søknad.søker.utenlandsperioder.map(periode => periode.oppholdsland.svar),
    ].flat();

    const fraOmBarnet = søknad.barnInkludertISøknaden
        .flatMap((barn: IBarnMedISøknad) => [
            ...(barn.andreForelder
                ? [
                      barn.andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand]
                          .svar,
                      barn.andreForelder[andreForelderDataKeySpørsmål.pensjonHvilketLand].svar,
                  ]
                : []),
            barn.barnetrygdFraEøslandHvilketLand.svar,
            barn.utenlandsperioder.map(periode => periode.oppholdsland.svar),
        ])
        .flat();
    return fraOmDeg.concat(fraOmBarnet);
};

export const jaNeiSvarTriggerEøs = (søknad: ISøknad) =>
    søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar === ESvar.JA;
