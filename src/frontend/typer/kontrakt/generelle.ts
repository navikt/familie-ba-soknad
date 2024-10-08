import { ISODateString, LocaleType } from '../common';
import { FlettefeltVerdier, LocaleRecordBlock, LocaleRecordString } from '../sanity/sanity';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type SpørsmålMap = Record<string, ISøknadsfelt<any>>;

export enum ESøknadstype {
    ORDINÆR = 'ORDINÆR',
    UTVIDET = 'UTVIDET',
}

export interface ISøknadsfelt<T> {
    label: Record<LocaleType, string>;
    verdi: Record<LocaleType, T>;
}

export type TilRestLocaleRecord = (
    sanityTekst: LocaleRecordString | LocaleRecordBlock,
    flettefelter?: FlettefeltVerdier
) => Record<LocaleType, string>;

export interface IKontraktTidligereSamboer extends IKontraktNåværendeSamboer {
    samboerTilDato: ISøknadsfelt<ISODateString>;
}

export interface IUtenlandsperiodeIKontraktFormat {
    utenlandsoppholdÅrsak: ISøknadsfelt<string>;
    oppholdsland: ISøknadsfelt<string>;
    oppholdslandTilDato: ISøknadsfelt<string | undefined>;
    oppholdslandFraDato: ISøknadsfelt<string | undefined>;
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

export interface IAdresse {
    adressenavn?: string;
    postnummer?: string;
    husbokstav?: string;
    bruksenhetsnummer?: string;
    husnummer?: string;
    poststed?: string;
}

export enum ERegistrertBostedType {
    REGISTRERT_SOKERS_ADRESSE = 'REGISTRERT_SOKERS_ADRESSE',
    REGISTRERT_ANNEN_ADRESSE = 'REGISTRERT_ANNEN_ADRESSE',
    IKKE_FYLT_INN = 'IKKE_FYLT_INN',
    ADRESSESPERRE = 'ADRESSESPERRE',
}

export interface IKontraktNåværendeSamboer {
    navn: ISøknadsfelt<string>;
    ident: ISøknadsfelt<string>;
    fødselsdato: ISøknadsfelt<string>;
    samboerFraDato: ISøknadsfelt<ISODateString>;
}

export enum Slektsforhold {
    FORELDER = 'FORELDER',
    ONKEL_ELLER_TANTE = 'ONKEL_ELLER_TANTE',
    BESTEFORELDER = 'BESTEFORELDER',
    ANNEN_FAMILIERELASJON = 'ANNEN_FAMILIERELASJON',
    ANNEN_RELASJON = 'ANNEN_RELASJON',
}
