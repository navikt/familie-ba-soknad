import type { LocaleType } from '../../common/typer/localeType';

import type { ISøknad } from './søknad';

export interface IMellomlagretBarnetrygd {
    søknad: ISøknad;
    sisteUtfylteStegIndex: number;
    modellVersjon: number;
    locale: LocaleType;
    datoSistLagret: string;
}
