import { PortableTextBlock } from '@portabletext/types';

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

export const frittståendeOrdPrefix = 'FRITTSTAENDEORD';

export interface ISanitySpørsmålDokument extends SanityDokument {
    sporsmal: LocaleRecordBlock;
    feilmelding: LocaleRecordBlock;
    alert?: LocaleRecordBlock;
    beskrivelse?: LocaleRecordBlock;
    vedleggsnotis?: LocaleRecordBlock;
    checkboxLabel?: LocaleRecordBlock;
}
