import { ESvar } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput } from '../../../typer/person';

export const formaterInitVerdiForInputMedUkjent = (verdi: string) =>
    verdi !== AlternativtSvarForInput.UKJENT ? verdi : '';

export const formaterVerdiForCheckbox = (svar: string | AlternativtSvarForInput) =>
    svar === AlternativtSvarForInput.UKJENT ? ESvar.JA : ESvar.NEI;
