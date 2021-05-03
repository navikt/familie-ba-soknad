import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';

import { ISøknadSpørsmål } from './søknad';

export enum ESivilstand {
    GIFT = 'GIFT',
    ENKE_ELLER_ENKEMANN = 'ENKE_ELLER_ENKEMANN',
    SKILT = 'SKILT',
    SEPARERT = 'SEPARERT',
    REGISTRERT_PARTNER = 'REGISTRERT_PARTNER',
    SEPARERT_PARTNER = 'SEPARERT_PARTNER',
    SKILT_PARTNER = 'SKILT_PARTNER',
    GJENLEVENDE_PARTNER = 'GJENLEVENDE_PARTNER',
    UGIFT = 'UGIFT',
    UOPPGITT = 'UOPPGITT',
}

export interface IPerson {
    ident: string;
    navn: string;
}

export interface ISøkerRespons extends IPerson {
    barn: IBarnRespons[];
    statsborgerskap: { landkode: Alpha3Code }[];
    adresse?: IAdresse;
    sivilstand: { type: ESivilstand };
}

export interface ISøker extends ISøkerRespons {
    telefonnummer: ISøknadSpørsmål<string>;
    borPåRegistrertAdresse: ISøknadSpørsmål<ESvar | undefined>;
    oppholderSegINorge: ISøknadSpørsmål<ESvar | undefined>;
    oppholdsland: ISøknadSpørsmål<Alpha3Code | ''>;
    oppholdslandDato: ISøknadSpørsmål<ISODateString>;
    værtINorgeITolvMåneder: ISøknadSpørsmål<ESvar | undefined>;
    komTilNorgeDato: ISøknadSpørsmål<ISODateString>;
    planleggerÅBoINorgeTolvMnd: ISøknadSpørsmål<ESvar | undefined>;
    erAsylsøker: ISøknadSpørsmål<ESvar | undefined>;
    jobberPåBåt: ISøknadSpørsmål<ESvar | undefined>;
    arbeidsland: ISøknadSpørsmål<Alpha3Code | ''>;
    mottarUtenlandspensjon: ISøknadSpørsmål<ESvar | undefined>;
    pensjonsland: ISøknadSpørsmål<Alpha3Code | ''>;
}

export interface IAdresse {
    adressenavn?: string;
    postnummer?: string;
    husbokstav?: string;
    bruksenhetsnummer?: string;
    husnummer?: string;
    poststed?: string;
}

export enum barnDataKeySpørsmål {
    erFosterbarn = 'erFosterbarn',
    erAdoptertFraUtland = 'erAdoptertFraUtland',
    erAsylsøker = 'erAsylsøker',
    barnetrygdFraAnnetEøsland = 'barnetrygdFraAnnetEøsland',
    oppholderSegIInstitusjon = 'oppholderSegIInstitusjon',
    oppholdtSegINorgeSammenhengendeTolvMnd = 'oppholdtSegINorgeSammenhengendeTolvMnd',
    oppholderSegIUtland = 'oppholderSegIUtland',
    oppholdsland = 'oppholdsland',
    oppholdslandStartdato = 'oppholdslandStartdato',
    oppholdslandSluttdato = 'oppholdslandSluttdato',
    institusjonsnavn = 'institusjonsnavn',
    institusjonsadresse = 'institusjonsadresse',
    institusjonspostnummer = 'institusjonspostnummer',
    institusjonOppholdStartdato = 'institusjonOppholdStartdato',
    institusjonOppholdSluttdato = 'institusjonOppholdSluttdato',
}

export interface IBarnRespons extends IPerson {
    borMedSøker: boolean;
    fødselsdato: string | undefined;
}

export interface IBarn extends IPerson {
    borMedSøker: boolean | undefined;
    alder: string | undefined;
}

export enum AlternativtDatoSvar {
    UKJENT = 'UKJENT',
}

export type DatoMedUkjent = ISODateString | AlternativtDatoSvar.UKJENT;

export interface IBarnMedISøknad extends IBarn {
    [barnDataKeySpørsmål.erFosterbarn]: ISøknadSpørsmål<ESvar | undefined>;
    [barnDataKeySpørsmål.oppholderSegIInstitusjon]: ISøknadSpørsmål<ESvar | undefined>;
    [barnDataKeySpørsmål.erAdoptertFraUtland]: ISøknadSpørsmål<ESvar | undefined>;
    [barnDataKeySpørsmål.oppholderSegIUtland]: ISøknadSpørsmål<ESvar | undefined>;
    [barnDataKeySpørsmål.oppholdsland]: ISøknadSpørsmål<Alpha3Code | ''>;
    [barnDataKeySpørsmål.oppholdslandStartdato]: ISøknadSpørsmål<ISODateString>;
    [barnDataKeySpørsmål.oppholdslandSluttdato]: ISøknadSpørsmål<ISODateString>;
    [barnDataKeySpørsmål.erAsylsøker]: ISøknadSpørsmål<ESvar | undefined>;
    [barnDataKeySpørsmål.oppholdtSegINorgeSammenhengendeTolvMnd]: ISøknadSpørsmål<
        ESvar | undefined
    >;
    [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: ISøknadSpørsmål<ESvar | undefined>;
    [barnDataKeySpørsmål.institusjonsnavn]: ISøknadSpørsmål<string>;
    [barnDataKeySpørsmål.institusjonsadresse]: ISøknadSpørsmål<string>;
    [barnDataKeySpørsmål.institusjonspostnummer]: ISøknadSpørsmål<string>;
    [barnDataKeySpørsmål.institusjonOppholdStartdato]: ISøknadSpørsmål<ISODateString>;
    [barnDataKeySpørsmål.institusjonOppholdSluttdato]: ISøknadSpørsmål<DatoMedUkjent>;
}
