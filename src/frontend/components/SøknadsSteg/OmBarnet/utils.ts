import { AlternativtSvarForInput } from '../../../typer/person';

export const formaterInitVerdiForInputMedUkjent = (verdi: string) =>
    verdi !== AlternativtSvarForInput.UKJENT ? verdi : '';
