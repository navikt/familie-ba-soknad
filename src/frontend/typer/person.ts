import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';

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
    værtINorgeITolvMåneder: ISøknadSpørsmål<ESvar | undefined>;
    erAsylsøker: ISøknadSpørsmål<ESvar | undefined>;
    jobberPåBåt: ISøknadSpørsmål<ESvar | undefined>;
    arbeidsland: ISøknadSpørsmål<Alpha3Code | undefined>;
    mottarUtenlandspensjon: ISøknadSpørsmål<ESvar | undefined>;
    pensjonsland: ISøknadSpørsmål<Alpha3Code | undefined>;
}

export interface IBarn extends IBarnFraPdl {
    alder: string;
    erFosterbarn: ISøknadSpørsmål<ESvar | undefined>;
    oppholderSegIInstitusjon: ISøknadSpørsmål<ESvar | undefined>;
    erAdoptertFraUtland: ISøknadSpørsmål<ESvar | undefined>;
    oppholderSegIUtland: ISøknadSpørsmål<ESvar | undefined>;
    erAsylsøker: ISøknadSpørsmål<ESvar | undefined>;
    oppholdtSegINorgeSammenhengendeTolvMnd: ISøknadSpørsmål<ESvar | undefined>;
    barnetrygdFraAnnetEøsland: ISøknadSpørsmål<ESvar | undefined>;
}

export interface IAdresse {
    adressenavn?: string;
    postnummer?: string;
    husbokstav?: string;
    bruksenhetsnummer?: string;
    husnummer?: string;
    bostedskommune?: string;
}
