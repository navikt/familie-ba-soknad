import { LocaleType } from '@navikt/familie-sprakvelger';

import { ISøknad } from './søknad';

export interface IMellomlagretBarnetrygd {
    søknad: ISøknad;
    sisteUtfylteStegIndex: number;
    modellVersjon: number;
    eøsToggleErPå: boolean;
    locale: LocaleType;
}
