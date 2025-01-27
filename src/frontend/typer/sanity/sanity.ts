import { PortableTextBlock } from '@portabletext/types';
import { Alpha3Code } from 'i18n-iso-countries';

import { LocaleType } from '../common';

export interface SanityDokument {
    _createdAt: string;
    _rev: string;
    _type: string;
    _id: string;
    api_navn: string;
    steg: ESanitySteg;
    visningsnavn: string;
    ytelse: string;
}

export enum ESanitySteg {
    FORSIDE = 'FORSIDE',
    OM_DEG = 'OM_DEG',
    DIN_LIVSSITUASJON = 'DIN_LIVSSITUASJON',
    VELG_BARN = 'VELG_BARN',
    OM_BARNA = 'OM_BARNA',
    OM_BARNET = 'OM_BARNET',
    EØS_FOR_SØKER = 'EØS_FOR_SØKER',
    EØS_FOR_BARN = 'EØS_FOR_BARN',
    OPPSUMMERING = 'OPPSUMMERING',
    DOKUMENTASJON = 'DOKUMENTASJON',
    KVITTERING = 'KVITTERING',
    FELLES = 'FELLES',
}

export type LocaleRecordBlock = Record<LocaleType, PortableTextBlock[]> & {
    api_navn: string;
    [key: string]: unknown;
};

export type LocaleRecordString = Record<LocaleType, string> & {
    api_navn: string;
    [key: string]: unknown;
};

export enum Typografi {
    StegHeadingH1 = 'StegHeadingH1',
    ModalHeadingH1 = 'ModalHeadingH1',
    ForsideHeadingH1 = 'ForsideHeadingH1',
    BodyLong = 'BodyLong',
    BodyShort = 'BodyShort',
    Label = 'Label',
    Detail = 'Detail',
    HeadingH2 = 'HeadingH2',
}

export const frittståendeOrdPrefix = 'FRITTSTAENDEORD';
export const modalPrefix = 'MODAL';
export const navigasjonPrefix = 'NAVIGASJON';
export const formateringsfeilmeldingerPrefix = 'FORMATERINGSFEILMELDINGER';
export const vedlikeholdsarbeidPrefix = 'VEDLIKEHOLDSARBEID';
export const kanIkkeBrukeSoeknadPrefix = 'KAN_IKKE_BRUKE_SOKNAD';

export interface ISanitySpørsmålDokument extends SanityDokument {
    sporsmal: LocaleRecordBlock;
    feilmelding: LocaleRecordBlock;
    alert?: LocaleRecordBlock;
    beskrivelse?: LocaleRecordBlock;
    vedleggsnotis?: LocaleRecordBlock;
    checkboxLabel?: LocaleRecordBlock;
}

export enum ESanityFlettefeltverdi {
    BARN_NAVN = 'BARN_NAVN',
    SØKER_NAVN = 'SØKER_NAVN',
    I_UTENFOR = 'I_UTENFOR',
    UTLANDET_NORGE = 'UTLANDET_NORGE',
    ANTALL = 'ANTALL',
    TOTAL_ANTALL = 'TOTAL_ANTALL',
    LAND = 'LAND',
    DATO = 'DATO',
    KLOKKESLETT = 'KLOKKESLETT',
    YTELSE = 'YTELSE',
    YTELSE_BESTEMT_FORM = 'YTELSE_BESTEMT_FORM',
}

export enum ESanitySivilstandApiKey {
    GIFT = 'sivilstandGift',
    ENKE_ELLER_ENKEMANN = 'sivilstandEnkeEnkemann',
    SKILT = 'sivilstandSkilt',
    SEPARERT = 'sivilstandSeparert',
    REGISTRERT_PARTNER = 'sivilstandRegistrertPartner',
    SEPARERT_PARTNER = 'sivilstandSeparertPartner',
    SKILT_PARTNER = 'sivilstandSkiltPartner',
    GJENLEVENDE_PARTNER = 'sivilstandGjenlevendePartner',
    UGIFT = 'sivilstandUgift',
    UOPPGITT = 'sivilstandUoppgitt',
}

export type FlettefeltVerdier = {
    barnetsNavn?: string;
    gjelderUtland?: boolean;
    antall?: string;
    totalAntall?: string;
    land?: Alpha3Code | '';
    dato?: string;
    klokkeslett?: string;
};

export type PlainTekst = (
    localeRecord: LocaleRecordBlock | LocaleRecordString | undefined,
    flettefelter?: FlettefeltVerdier,
    spesifikkLocale?: LocaleType
) => string;
