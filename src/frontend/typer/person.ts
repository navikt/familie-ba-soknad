import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';

import { ISøknadSpørsmål } from './søknad';

export interface IBarnFraPdl {
    ident: string;
    navn: string;
    borMedSøker: boolean | undefined;
    fødselsdato: string;
}

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

export interface ISøkerFraPdl {
    navn: string;
    barn: IBarnFraPdl[];
    statsborgerskap: { landkode: Alpha3Code }[];
    ident: string;
    adresse?: IAdresse;
    sivilstand: { type: ESivilstand };
}

export interface ISøker extends ISøkerFraPdl {
    telefonnummer: ISøknadSpørsmål<string>;
    borPåRegistrertAdresse: ISøknadSpørsmål<ESvar | undefined>;
    oppholderSegINorge: ISøknadSpørsmål<ESvar | undefined>;
    oppholdsland: ISøknadSpørsmål<Alpha3Code | undefined>;
    oppholdslandDato: ISøknadSpørsmål<ISODateString>;
    værtINorgeITolvMåneder: ISøknadSpørsmål<ESvar | undefined>;
    komTilNorgeDato: ISøknadSpørsmål<ISODateString>;
    erAsylsøker: ISøknadSpørsmål<ESvar | undefined>;
    jobberPåBåt: ISøknadSpørsmål<ESvar | undefined>;
    arbeidsland: ISøknadSpørsmål<Alpha3Code | undefined>;
    mottarUtenlandspensjon: ISøknadSpørsmål<ESvar | undefined>;
    pensjonsland: ISøknadSpørsmål<Alpha3Code | undefined>;
}

export interface IAdresse {
    adressenavn?: string;
    postnummer?: string;
    husbokstav?: string;
    bruksenhetsnummer?: string;
    husnummer?: string;
    bostedskommune?: string;
}

export enum barnDataKeySpørsmål {
    erFosterbarn = 'erFosterbarn',
    erAdoptertFraUtland = 'erAdoptertFraUtland',
    erAsylsøker = 'erAsylsøker',
    barnetrygdFraAnnetEøsland = 'barnetrygdFraAnnetEøsland',
    oppholderSegIInstitusjon = 'oppholderSegIInstitusjon',
    oppholdtSegINorgeSammenhengendeTolvMnd = 'oppholdtSegINorgeSammenhengendeTolvMnd',
    oppholderSegIUtland = 'oppholderSegIUtland',
}

export interface IBarn extends IBarnFraPdl {
    alder: string;
    [barnDataKeySpørsmål.erFosterbarn]: ISøknadSpørsmål<ESvar | undefined>;
    [barnDataKeySpørsmål.oppholderSegIInstitusjon]: ISøknadSpørsmål<ESvar | undefined>;
    [barnDataKeySpørsmål.erAdoptertFraUtland]: ISøknadSpørsmål<ESvar | undefined>;
    [barnDataKeySpørsmål.oppholderSegIUtland]: ISøknadSpørsmål<ESvar | undefined>;
    [barnDataKeySpørsmål.erAsylsøker]: ISøknadSpørsmål<ESvar | undefined>;
    [barnDataKeySpørsmål.oppholdtSegINorgeSammenhengendeTolvMnd]: ISøknadSpørsmål<
        ESvar | undefined
    >;
    [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: ISøknadSpørsmål<ESvar | undefined>;
}
