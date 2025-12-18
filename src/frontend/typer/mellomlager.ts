import { LocaleType } from '../../common/typer/localeType';

import { ISøknad } from './søknad';

export interface IMellomlagretBarnetrygd {
    søknad: ISøknad;
    sisteUtfylteStegIndex: number;
    modellVersjon: number;
    locale: LocaleType;
    datoSistLagret: string;
}
