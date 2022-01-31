import { LocaleType } from '@navikt/familie-sprakvelger';

import { ISøknadKontraktBarn } from './barn';
import { ISøknadKontraktDokumentasjon } from './dokumentasjon';
import {
    ESivilstand,
    ESøknadstype,
    IAdresse,
    IKontraktNåværendeSamboer,
    IKontraktTidligereSamboer,
    ISøknadsfelt,
    IUtenlandsperiodeIKontraktFormat,
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

export interface ISøknadKontraktSøker {
    ident: ISøknadsfelt<string>;
    navn: ISøknadsfelt<string>;
    statsborgerskap: ISøknadsfelt<string[]>;
    adresse: ISøknadsfelt<IAdresse>;
    sivilstand: ISøknadsfelt<ESivilstand>;
    spørsmål: SpørsmålMap;
    tidligereSamboere: ISøknadsfelt<IKontraktTidligereSamboer>[];
    nåværendeSamboer: ISøknadsfelt<IKontraktNåværendeSamboer> | null;
    utenlandsperioder: ISøknadsfelt<IUtenlandsperiodeIKontraktFormat>[];
    // nye
    arbeidsperioderUtland: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
}

export interface IArbeidsperiodeIKontraktFormat {
    arbeidsperiodeAvsluttet: ISøknadsfelt<string | undefined>;
    arbeidsperiodeland: ISøknadsfelt<string | undefined>;
    arbeidsgiver: ISøknadsfelt<string | undefined>;
    fraDatoArbeidsperiode: ISøknadsfelt<string | undefined>;
    tilDatoArbeidsperiode: ISøknadsfelt<string | undefined>;
}
