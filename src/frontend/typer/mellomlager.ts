import { LocaleType } from '../components/Felleskomponenter/Dekoratøren/SpråkContext';

import { ISøknad } from './søknad';

export interface IMellomlagretBarnetrygd {
    søknad: ISøknad;
    sisteUtfylteStegIndex: number;
    modellVersjon: number;
    locale: LocaleType;
}
