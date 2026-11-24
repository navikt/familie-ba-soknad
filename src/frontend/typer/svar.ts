import type { ISODateString } from '@common/typer/ISODateString';
import type { ESvar } from '@navikt/familie-form-elements';

export type ESvarMedUbesvart = ESvar | null;

export enum AlternativtSvarForInput {
    UKJENT = 'UKJENT',
    ANNEN_FORELDER = 'ANNEN_FORELDER',
}

export type DatoMedUkjent = ISODateString | AlternativtSvarForInput.UKJENT;
