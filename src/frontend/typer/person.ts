import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';

import { ISøknadSpørsmål } from './søknad';

export interface IPerson {
    navn: string;
    barn: IBarn[];
}

interface IBarn {
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

export interface IPersonFraPdl {
    navn: string;
    barn: IBarn[];
    statsborgerskap: { landkode: Alpha3Code }[];
    ident: string;
    adresse?: IAdresse;
    sivilstand: { type: ESivilstand };
}

export interface ISøkerNy extends IPersonFraPdl {
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

export interface IBarnNy {
    navn: string;
    ident: string;
    fødselsdato: string;
    borMedSøker: boolean | undefined;
    alder: string;
}

export interface IAdresse {
    adressenavn?: string;
    postnummer?: string;
    husbokstav?: string;
    bruksenhetsnummer?: string;
    husnummer?: string;
    bostedskommune?: string;
}
