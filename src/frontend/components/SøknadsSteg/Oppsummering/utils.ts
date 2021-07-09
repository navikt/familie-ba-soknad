import { AlternativtSvarForInput, DatoMedUkjent } from '../../../typer/person';
import { formaterDato } from '../../../utils/dato';

export const formaterDatoMedUkjent = (datoMedUkjent: DatoMedUkjent, tekstForUkjent) => {
    return datoMedUkjent === AlternativtSvarForInput.UKJENT
        ? tekstForUkjent
        : formaterDato(datoMedUkjent);
};
