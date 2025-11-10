import { LocaleType } from '../../common/typer/common';
import { AlternativtSvarForInput, DatoMedUkjent } from '../typer/common';

import { formaterDato, formaterDatostringKunMåned } from './dato';

export const formaterFnr = (fødselsnummer: string) => {
    return fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6, 11);
};

export const formaterDatoMedUkjent = (datoMedUkjent: DatoMedUkjent, tekstForUkjent): string => {
    return datoMedUkjent === AlternativtSvarForInput.UKJENT ? tekstForUkjent : formaterDato(datoMedUkjent);
};

export const formaterMånedMedUkjent = (svar: string, vetIkkeTekst, valgtLocale: LocaleType) => {
    if (svar === AlternativtSvarForInput.UKJENT) {
        return vetIkkeTekst;
    } else {
        return uppercaseFørsteBokstav(formaterDatostringKunMåned(svar, valgtLocale));
    }
};

export const uppercaseFørsteBokstav = text => {
    if (typeof text !== 'string') return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
};
