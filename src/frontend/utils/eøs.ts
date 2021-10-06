import { ESvar } from '@navikt/familie-form-elements';

import { IBarnMedISøknad } from '../typer/person';
import { ISøknad } from '../typer/søknad';

export const landSvarSomKanTriggeEøs = (søknad: ISøknad) =>
    søknad.barnInkludertISøknaden.flatMap((barn: IBarnMedISøknad) => [
        barn.oppholdsland.svar,
        barn.barnetrygdFraEøslandHvilketLand.svar,
    ]);

export const jaNeiSvarTriggerEøs = (søknad: ISøknad) =>
    søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar === ESvar.JA;
