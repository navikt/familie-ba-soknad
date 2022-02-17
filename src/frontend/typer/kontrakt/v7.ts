import { ESvar } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import { ISøknadKontraktDokumentasjon } from './dokumentasjon';
import {
    ERegistrertBostedType,
    ESivilstand,
    ESøknadstype,
    IAdresse,
    IAndreForelderIKontraktFormat,
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
    barn: ISøknadIKontraktBarnV7[];
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
    // eøs
    arbeidsperioderUtland: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonsperioderUtland: ISøknadsfelt<IPensjonsperiodeIKontraktFormatV7>[];
    arbeidsperioderNorge: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonsperioderNorge: ISøknadsfelt<IPensjonsperiodeIKontraktFormatV7>[];
    andreUtbetalingsperioder: ISøknadsfelt<IUtbetalingsperiodeIKontraktFormat7>[];
}

export interface ISøknadIKontraktBarnV7 {
    ident: ISøknadsfelt<string>;
    navn: ISøknadsfelt<string>;
    registrertBostedType: ISøknadsfelt<ERegistrertBostedType>;
    alder: ISøknadsfelt<string>;
    spørsmål: SpørsmålMap;
    utenlandsperioder: ISøknadsfelt<IUtenlandsperiodeIKontraktFormat>[];
    andreForelder: IAndreForelderIKontraktFormat | null;
    eøsBarnetrygdsperioder: ISøknadsfelt<IEøsBarnetrygdsperiodeIKontraktFormatV7>[];
}

export interface IAndreForelderIKontraktFormatV7 {
    navn: ISøknadsfelt<string>;
    fnr: ISøknadsfelt<string>;
    fødselsdato: ISøknadsfelt<string>;
    pensjonUtland: ISøknadsfelt<ESvar | null>;
    pensjonHvilketLand: ISøknadsfelt<string>;
    arbeidUtlandet: ISøknadsfelt<ESvar | null>;
    arbeidUtlandetHvilketLand: ISøknadsfelt<string>;
    skriftligAvtaleOmDeltBosted: ISøknadsfelt<ESvar | null>;
    utvidet: {
        søkerHarBoddMedAndreForelder: ISøknadsfelt<ESvar | null>;
        søkerFlyttetFraAndreForelderDato: ISøknadsfelt<string>;
    };

    //EØS
    arbeidsperioderUtland: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonsperioderUtland: ISøknadsfelt<IPensjonsperiodeIKontraktFormatV7>[];
    arbeidsperioderNorge: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonsperioderNorge: ISøknadsfelt<IPensjonsperiodeIKontraktFormatV7>[];
    andreUtbetalingsperioder: ISøknadsfelt<IUtbetalingsperiodeIKontraktFormat7>[];
}

export interface IArbeidsperiodeIKontraktFormat {
    arbeidsperiodeAvsluttet: ISøknadsfelt<string | undefined>;
    arbeidsperiodeland: ISøknadsfelt<string | undefined>;
    arbeidsgiver: ISøknadsfelt<string | undefined>;
    fraDatoArbeidsperiode: ISøknadsfelt<string | undefined>;
    tilDatoArbeidsperiode: ISøknadsfelt<string | undefined>;
}

export interface IPensjonsperiodeIKontraktFormatV7 {
    mottarPensjonNå: ISøknadsfelt<ESvar | null>;
    pensjonsland?: ISøknadsfelt<string | undefined>;
    pensjonFra?: ISøknadsfelt<string | undefined>;
    pensjonTil?: ISøknadsfelt<string | undefined>;
}

export interface IEøsBarnetrygdsperiodeIKontraktFormatV7 {
    mottarEøsBarnetrygdNå: ISøknadsfelt<ESvar | null>;
    barnetrygdsland: ISøknadsfelt<string | undefined>;
    fraDatoBarnetrygdperiode: ISøknadsfelt<string | undefined>;
    tilDatoBarnetrygdperiode: ISøknadsfelt<string | undefined>;
    månedligBeløp: ISøknadsfelt<string | undefined>;
}

export interface IUtbetalingsperiodeIKontraktFormat7 {
    fårUtbetalingNå: ISøknadsfelt<ESvar | null>;
    utbetalingLand: ISøknadsfelt<string | undefined>;
    utbetalingFraDato: ISøknadsfelt<string | undefined>;
    utbetalingTilDato: ISøknadsfelt<string | undefined>;
}
