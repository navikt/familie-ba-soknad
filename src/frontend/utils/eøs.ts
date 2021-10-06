import { IBarnMedISøknad } from '../typer/person';
import { ISøknad } from '../typer/søknad';

export const landSvarSomKanTriggeEøs = (søknad: ISøknad) =>
    søknad.barnInkludertISøknaden.flatMap((barn: IBarnMedISøknad) => [
        barn.oppholdsland.svar,
        barn.barnetrygdFraEøslandHvilketLand.svar,
    ]);
