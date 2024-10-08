import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';

import { ISODateString, LocaleType } from '../common';

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

export interface ISøknadKontrakt {
    kontraktVersjon: number;
    antallEøsSteg: number;
    søknadstype: ESøknadstype;
    søker: ISøknadKontraktSøker;
    barn: ISøknadIKontraktBarn[];
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
    adresse: ISøknadsfelt<IAdresse | null>;
    adressebeskyttelse: boolean;
    sivilstand: ISøknadsfelt<ESivilstand>;
    spørsmål: SpørsmålMap;
    tidligereSamboere: ISøknadsfelt<IKontraktTidligereSamboer>[];
    nåværendeSamboer: ISøknadsfelt<IKontraktNåværendeSamboer> | null;
    utenlandsperioder: ISøknadsfelt<IUtenlandsperiodeIKontraktFormat>[];
    // eøs
    arbeidsperioderUtland: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonsperioderUtland: ISøknadsfelt<IPensjonsperiodeIKontraktFormat>[];
    arbeidsperioderNorge: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonsperioderNorge: ISøknadsfelt<IPensjonsperiodeIKontraktFormat>[];
    andreUtbetalingsperioder: ISøknadsfelt<IUtbetalingsperiodeIKontraktFormat>[];
    idNummer: ISøknadsfelt<IIdNummerIKontraktFormat>[];
}

export interface ISøknadIKontraktBarn {
    harEøsSteg: boolean;
    ident: ISøknadsfelt<string>;
    navn: ISøknadsfelt<string>;
    registrertBostedType: ISøknadsfelt<ERegistrertBostedType>;
    alder: ISøknadsfelt<string> | null;
    spørsmål: SpørsmålMap;
    utenlandsperioder: ISøknadsfelt<IUtenlandsperiodeIKontraktFormat>[];
    omsorgsperson: IOmsorgspersonIKontraktFormat | null;
    andreForelder: IAndreForelderIKontraktFormat | null;
    eøsBarnetrygdsperioder: ISøknadsfelt<IEøsBarnetrygdsperiodeIKontraktFormat>[];
    idNummer: ISøknadsfelt<IIdNummerIKontraktFormat>[];
}

export interface IOmsorgspersonIKontraktFormat {
    navn: ISøknadsfelt<string>;
    slektsforhold: ISøknadsfelt<string>;
    slektsforholdSpesifisering: ISøknadsfelt<string> | null;
    idNummer: ISøknadsfelt<string>;
    adresse: ISøknadsfelt<string>;
    arbeidUtland: ISøknadsfelt<ESvar>;
    arbeidsperioderUtland: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    arbeidNorge: ISøknadsfelt<ESvar>;
    arbeidsperioderNorge: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonUtland: ISøknadsfelt<ESvar>;
    pensjonsperioderUtland: ISøknadsfelt<IPensjonsperiodeIKontraktFormat>[];
    pensjonNorge: ISøknadsfelt<ESvar>;
    pensjonsperioderNorge: ISøknadsfelt<IPensjonsperiodeIKontraktFormat>[];
    andreUtbetalinger: ISøknadsfelt<ESvar>;
    andreUtbetalingsperioder: ISøknadsfelt<IUtbetalingsperiodeIKontraktFormat>[];
    pågåendeSøknadFraAnnetEøsLand: ISøknadsfelt<ESvar>;
    pågåendeSøknadHvilketLand: ISøknadsfelt<string> | null;
    barnetrygdFraEøs: ISøknadsfelt<ESvar>;
    eøsBarnetrygdsperioder: ISøknadsfelt<IEøsBarnetrygdsperiodeIKontraktFormat>[];
}

export interface IAndreForelderUtvidetIKontraktFormat {
    søkerHarBoddMedAndreForelder: ISøknadsfelt<ESvar> | null;
    søkerFlyttetFraAndreForelderDato: ISøknadsfelt<string> | null;
}

export interface IAndreForelderIKontraktFormat {
    kanIkkeGiOpplysninger: ISøknadsfelt<ESvar>;
    navn: ISøknadsfelt<string> | null;
    fnr: ISøknadsfelt<string> | null;
    fødselsdato: ISøknadsfelt<string> | null;
    pensjonUtland: ISøknadsfelt<ESvar> | null;
    arbeidUtlandet: ISøknadsfelt<ESvar> | null;
    skriftligAvtaleOmDeltBosted: ISøknadsfelt<ESvar> | null;
    utvidet: IAndreForelderUtvidetIKontraktFormat;

    //EØS
    pensjonNorge: ISøknadsfelt<ESvar> | null;
    arbeidNorge: ISøknadsfelt<ESvar> | null;
    andreUtbetalinger: ISøknadsfelt<ESvar> | null;
    barnetrygdFraEøs: ISøknadsfelt<ESvar> | null;
    arbeidsperioderUtland: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonsperioderUtland: ISøknadsfelt<IPensjonsperiodeIKontraktFormat>[];
    arbeidsperioderNorge: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonsperioderNorge: ISøknadsfelt<IPensjonsperiodeIKontraktFormat>[];
    pågåendeSøknadFraAnnetEøsLand: ISøknadsfelt<ESvar> | null;
    pågåendeSøknadHvilketLand: ISøknadsfelt<string> | null;
    eøsBarnetrygdsperioder: ISøknadsfelt<IEøsBarnetrygdsperiodeIKontraktFormat>[];
    andreUtbetalingsperioder: ISøknadsfelt<IUtbetalingsperiodeIKontraktFormat>[];
    idNummer: ISøknadsfelt<IIdNummerIKontraktFormat>[];
    adresse: ISøknadsfelt<string> | null;
}

export interface IArbeidsperiodeIKontraktFormat {
    arbeidsperiodeAvsluttet: ISøknadsfelt<string> | null;
    arbeidsperiodeland: ISøknadsfelt<string> | null;
    arbeidsgiver: ISøknadsfelt<string> | null;
    fraDatoArbeidsperiode: ISøknadsfelt<ISODateString> | null;
    tilDatoArbeidsperiode: ISøknadsfelt<ISODateString> | null;
}

export interface IIdNummerIKontraktFormat {
    land: ISøknadsfelt<Alpha3Code>;
    idNummer: ISøknadsfelt<string>;
}

export interface IPensjonsperiodeIKontraktFormat {
    mottarPensjonNå: ISøknadsfelt<ESvar> | null;
    pensjonsland: ISøknadsfelt<string> | null;
    pensjonFra: ISøknadsfelt<ISODateString> | null;
    pensjonTil: ISøknadsfelt<ISODateString> | null;
}

export interface IEøsBarnetrygdsperiodeIKontraktFormat {
    mottarEøsBarnetrygdNå: ISøknadsfelt<ESvar> | null;
    barnetrygdsland: ISøknadsfelt<string>;
    fraDatoBarnetrygdperiode: ISøknadsfelt<ISODateString>;
    tilDatoBarnetrygdperiode: ISøknadsfelt<ISODateString> | null;
    månedligBeløp: ISøknadsfelt<string>;
}

export interface IUtbetalingsperiodeIKontraktFormat {
    fårUtbetalingNå: ISøknadsfelt<ESvar> | null;
    utbetalingLand: ISøknadsfelt<string>;
    utbetalingFraDato: ISøknadsfelt<ISODateString>;
    utbetalingTilDato: ISøknadsfelt<ISODateString | string>;
}
