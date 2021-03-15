import { Alpha3Code } from 'i18n-iso-countries';

export interface IPerson {
    navn: string;
    barn: IBarn[];
}

interface IBarn {
    ident: string;
    navn: string;
    borMedSøker: boolean;
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
    adresse: IAdresse;
    sivilstand: { type: ESivilstand };
    //fødselsdato: Date;
}

export interface ISøkerNy extends IPersonFraPdl {
    kontakttelefon: string;
}

export interface IBarnNy {
    navn: string;
    ident: string;
    fødselsdato: string;
    borMedSøker: boolean;
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
