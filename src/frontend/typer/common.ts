import { ESvar } from '@navikt/familie-form-elements';

export type ESvarMedUbesvart = ESvar | null;

export enum AlternativtSvarForInput {
    UKJENT = 'UKJENT',
    ANNEN_FORELDER = 'ANNEN_FORELDER',
}

export type DatoMedUkjent = ISODateString | AlternativtSvarForInput.UKJENT;
export type BarnetsId = string;

export type ISODateString = string;

export enum LocaleType {
    en = 'en',
    nb = 'nb',
    nn = 'nn',
}

export type HeadingLevel = '1' | '2' | '3' | '4' | '5' | '6';
