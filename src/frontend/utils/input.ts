import { ESvar } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput } from '../typer/svar';

export const formaterInitVerdiForInputMedUkjent = (verdi: string | undefined) =>
    !!verdi && verdi !== AlternativtSvarForInput.UKJENT ? verdi : '';

export const formaterVerdiForCheckbox = (svar: string | AlternativtSvarForInput | undefined) =>
    svar === AlternativtSvarForInput.UKJENT ? ESvar.JA : ESvar.NEI;
