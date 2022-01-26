import { LocaleType } from '@navikt/familie-sprakvelger';

import { ISøknadKontraktBarn } from './barn';
import { ISøknadKontraktDokumentasjon } from './dokumentasjon';
import { ESøknadstype, SpørsmålMap } from './generelle';
import { ISøknadKontraktSøker } from './søker';

export interface ISøknadKontraktV7 {
    kontraktVersjon: number;
    søknadstype: ESøknadstype;
    søker: ISøknadKontraktSøker;
    barn: ISøknadKontraktBarn[];
    spørsmål: SpørsmålMap;
    dokumentasjon: ISøknadKontraktDokumentasjon[];
    teksterUtenomSpørsmål: Record<string, Record<LocaleType, string>>;
    originalSpråk: LocaleType;
}
