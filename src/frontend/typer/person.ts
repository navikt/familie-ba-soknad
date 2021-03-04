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

export interface IAdresse {
    adresse: string;
    postnummer: string;
    poststed?: string;
}

export enum ESivilstand {
    // GIFT = 'GIFT',
    REPA = 'REPA',
    UGIF = 'UGIF',
    ENKE = 'ENKE',
    GJPA = 'GJPA',
    SEPA = 'SEPA',
    SEPR = 'SEPR',
    SKIL = 'SKIL',
    SAMB = 'SAMB',

    UOPPGITT = 'UOPPGITT',
    UGIFT = 'UGIFT',
    GIFT = 'GIFT',
    ENKE_ELLER_ENKEMANN = 'ENKE_ELLER_ENKEMANN',
    SKILT = 'SKILT',
    SEPARERT = 'SEPARERT',
    PARTNER = 'PARTNER',
    SEPARERT_PARTNER = 'SEPARERT_PARTNER',
    SKILT_PARTNER = 'SKILT_PARTNER',
    GJENLEVENDE_PARTNER = 'GJENLEVENDE_PARTNER',
}

export interface IPersonFraPdl {
    navn: string;
    barn: IBarn[];
    statsborgerskap: Alpha3Code[];
    //fødselsdato: Date;
    //fnr: string;
    //adresse: IAdresse;
    //sivilstand?: ESivilstand;
}

export interface ISøkerNy extends IPersonFraPdl {
    kontakttelefon?: string;
}

export interface IBarnNy {
    navn: string;
    ident: string;
    fødselsdato: string;
    borMedSøker: boolean;
    alder: string;
}
