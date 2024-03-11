import { PortableTextBlock } from '@portabletext/types';
import { Alpha3Code } from 'i18n-iso-countries';

import { LocaleType } from '@navikt/familie-sprakvelger';

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
    FELLES = 'FELLES',
}

export type LocaleRecordBlock = Record<LocaleType, PortableTextBlock[]> & {
    api_navn: string;
    [key: string]: unknown;
};

export enum Typografi {
    StegHeadingH1 = 'StegHeadingH1',
    ModalHeadingH1 = 'ModalHeadingH1',
    ForsideHeadingH1 = 'ForsideHeadingH1',
    Ingress = 'Ingress',
    BodyLong = 'BodyLong',
    BodyShort = 'BodyShort',
    Label = 'Label',
    Detail = 'Detail',
    HeadingH2 = 'HeadingH2',
}

export const frittståendeOrdPrefix = 'FRITTSTAENDEORD';

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
    localeRecord: LocaleRecordBlock | undefined,
    flettefelter?: FlettefeltVerdier,
    spesifikkLocale?: LocaleType
) => string;
