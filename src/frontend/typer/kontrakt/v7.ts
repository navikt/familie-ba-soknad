import { LocaleType } from '@navikt/familie-sprakvelger';

import {
    ESøknadstype,
    ISøknadKontraktBarn,
    ISøknadKontraktDokumentasjon,
    ISøknadKontraktSøker,
    SpørsmålMap,
} from './generelle';

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
