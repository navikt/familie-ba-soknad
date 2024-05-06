import { LocaleType } from './common';
import { ISøknad } from './søknad';

export interface IMellomlagretBarnetrygd {
    søknad: ISøknad;
    sisteUtfylteStegIndex: number;
    modellVersjon: number;
    locale: LocaleType;
}
