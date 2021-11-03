import { ESvar, ISODateString } from '@navikt/familie-form-elements';

export interface IPar {
    id: number;
    navn: string;
}

export interface INøkkelPar {
    [key: string]: IPar;
}

export type ESvarMedUbesvart = ESvar | null;

export enum AlternativtSvarForInput {
    UKJENT = 'UKJENT',
}

export type DatoMedUkjent = ISODateString | AlternativtSvarForInput.UKJENT;
export type BarnetsId = string;
