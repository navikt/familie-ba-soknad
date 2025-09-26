import { PlainTekst } from '../typer/sanity/sanity';
import { IFrittståendeOrdTekstinnhold } from '../typer/sanity/tekstInnhold';

export const slåSammen = (
    tekstListe: string[],
    plainTekst: PlainTekst,
    frittståendeOrdTekster: IFrittståendeOrdTekstinnhold
) => {
    if (tekstListe.length === 0) {
        return '';
    }

    if (tekstListe.length === 1) {
        return tekstListe[0];
    }

    return tekstListe.join(', ').replace(/,(?=[^,]+$)/, ` ${plainTekst(frittståendeOrdTekster.og)}`);
};
