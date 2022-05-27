import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import { ISøknadKontraktDokumentasjon } from './dokumentasjon';
import {
    ERegistrertBostedType,
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
    antallEøsSteg: number;
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
    harEøsSteg: boolean;
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
    andreUtbetalingsperioder: ISøknadsfelt<IUtbetalingsperiodeIKontraktFormatV7>[];
    idNummer: ISøknadsfelt<IIdNummerIKontraktFormat>[];
}

export interface ISøknadIKontraktBarnV7 {
    harEøsSteg: boolean;
    ident: ISøknadsfelt<string>;
    navn: ISøknadsfelt<string>;
    registrertBostedType: ISøknadsfelt<ERegistrertBostedType>;
    alder: ISøknadsfelt<string>;
    spørsmål: SpørsmålMap;
    utenlandsperioder: ISøknadsfelt<IUtenlandsperiodeIKontraktFormat>[];
    omsorgsperson: IOmsorgspersonIKontraktFormatV7 | null;
    andreForelder: IAndreForelderIKontraktFormatV7 | null;
    eøsBarnetrygdsperioder: ISøknadsfelt<IEøsBarnetrygdsperiodeIKontraktFormatV7>[];
    idNummer: ISøknadsfelt<IIdNummerIKontraktFormat>[];
}

export interface IOmsorgspersonIKontraktFormatV7 {
    navn: ISøknadsfelt<string>;
    slektsforhold: ISøknadsfelt<string>;
    slektsforholdSpesifisering: ISøknadsfelt<string>;
    idNummer: ISøknadsfelt<string>;
    adresse: ISøknadsfelt<string>;
    arbeidUtland: ISøknadsfelt<ESvar | null>;
    arbeidsperioderUtland: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    arbeidNorge: ISøknadsfelt<ESvar | null>;
    arbeidsperioderNorge: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonUtland: ISøknadsfelt<ESvar | null>;
    pensjonsperioderUtland: ISøknadsfelt<IPensjonsperiodeIKontraktFormatV7>[];
    pensjonNorge: ISøknadsfelt<ESvar | null>;
    pensjonsperioderNorge: ISøknadsfelt<IPensjonsperiodeIKontraktFormatV7>[];
    andreUtbetalinger: ISøknadsfelt<ESvar | null>;
    andreUtbetalingsperioder: ISøknadsfelt<IUtbetalingsperiodeIKontraktFormatV7>[];
    pågåendeSøknadFraAnnetEøsLand: ISøknadsfelt<ESvar | null>;
    pågåendeSøknadHvilketLand: ISøknadsfelt<string>;
    barnetrygdFraEøs: ISøknadsfelt<ESvar | null>;
    eøsBarnetrygdsperioder: ISøknadsfelt<IEøsBarnetrygdsperiodeIKontraktFormatV7>[];
}

export interface IAndreForelderIKontraktFormatV7 {
    kanIkkeGiOpplysninger: boolean;
    navn: ISøknadsfelt<string>;
    fnr: ISøknadsfelt<string>;
    fødselsdato: ISøknadsfelt<string>;
    pensjonUtland: ISøknadsfelt<ESvar | null>;
    arbeidUtlandet: ISøknadsfelt<ESvar | null>;
    skriftligAvtaleOmDeltBosted: ISøknadsfelt<ESvar | null>;
    utvidet: {
        søkerHarBoddMedAndreForelder: ISøknadsfelt<ESvar | null>;
        søkerFlyttetFraAndreForelderDato: ISøknadsfelt<string>;
    };

    //EØS
    pensjonNorge: ISøknadsfelt<ESvar | null>;
    arbeidNorge: ISøknadsfelt<ESvar | null>;
    andreUtbetalinger: ISøknadsfelt<ESvar | null>;
    barnetrygdFraEøs: ISøknadsfelt<ESvar | null>;
    arbeidsperioderUtland: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonsperioderUtland: ISøknadsfelt<IPensjonsperiodeIKontraktFormatV7>[];
    arbeidsperioderNorge: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonsperioderNorge: ISøknadsfelt<IPensjonsperiodeIKontraktFormatV7>[];
    pågåendeSøknadFraAnnetEøsLand: ISøknadsfelt<ESvar | null>;
    pågåendeSøknadHvilketLand: ISøknadsfelt<string>;
    eøsBarnetrygdsperioder: ISøknadsfelt<IEøsBarnetrygdsperiodeIKontraktFormatV7>[];
    andreUtbetalingsperioder: ISøknadsfelt<IUtbetalingsperiodeIKontraktFormatV7>[];
    idNummer: ISøknadsfelt<IIdNummerIKontraktFormat>[];
    adresse: ISøknadsfelt<string>;
}

export interface IArbeidsperiodeIKontraktFormat {
    arbeidsperiodeAvsluttet: ISøknadsfelt<string | null>;
    arbeidsperiodeland: ISøknadsfelt<string | null>;
    arbeidsgiver: ISøknadsfelt<string | null>;
    fraDatoArbeidsperiode: ISøknadsfelt<ISODateString | null>;
    tilDatoArbeidsperiode: ISøknadsfelt<ISODateString | null>;
}

export interface IIdNummerIKontraktFormat {
    land: ISøknadsfelt<Alpha3Code>;
    idNummer: ISøknadsfelt<string>;
}

export interface IPensjonsperiodeIKontraktFormatV7 {
    mottarPensjonNå: ISøknadsfelt<ESvar | null>;
    pensjonsland: ISøknadsfelt<string | null>;
    pensjonFra: ISøknadsfelt<ISODateString | null>;
    pensjonTil: ISøknadsfelt<ISODateString | null>;
}

export interface IEøsBarnetrygdsperiodeIKontraktFormatV7 {
    mottarEøsBarnetrygdNå: ISøknadsfelt<ESvar | null>;
    barnetrygdsland: ISøknadsfelt<string | null>;
    fraDatoBarnetrygdperiode: ISøknadsfelt<ISODateString>;
    tilDatoBarnetrygdperiode: ISøknadsfelt<ISODateString | null>;
    månedligBeløp: ISøknadsfelt<string>;
}

export interface IUtbetalingsperiodeIKontraktFormatV7 {
    fårUtbetalingNå: ISøknadsfelt<ESvar | null>;
    utbetalingLand: ISøknadsfelt<string>;
    utbetalingFraDato: ISøknadsfelt<ISODateString>;
    utbetalingTilDato: ISøknadsfelt<ISODateString | string>;
}
