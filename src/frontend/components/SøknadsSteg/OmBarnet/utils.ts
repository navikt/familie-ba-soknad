import { ESvar } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput } from '../../../typer/person';

export const formaterInitVerdiForInputMedUkjent = (verdi: string) =>
    verdi !== AlternativtSvarForInput.UKJENT ? verdi : '';

export const formaterVerdiForCheckbox = (svar: string | AlternativtSvarForInput) =>
    svar === AlternativtSvarForInput.UKJENT ? ESvar.JA : ESvar.NEI;

export const regexNorskEllerUtenlandskPostnummer = (verdi: string) =>
    verdi.match(/^[A-Za-z0-9-æøåÆØÅ-]{3,10}$/);
