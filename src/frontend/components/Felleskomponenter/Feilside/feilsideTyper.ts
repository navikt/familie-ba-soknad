import { LocaleType } from '../../../typer/common';

export interface IFeilsideTekster {
    locale: LocaleType;
    språktekst: string;
    statuskode: string;
    tittel: string;
    beskrivelse: string;
    duKanPrøveÅ: string;
    venteNoenMinutter: {
        vanligTekst: string;
        lenkeTekst: string;
    };
    gåTilbakeTilForrigeSide: string;
    hvisProblemetVedvarer: {
        vanligTekst: string;
        lenkeTekst: string;
    };
}
