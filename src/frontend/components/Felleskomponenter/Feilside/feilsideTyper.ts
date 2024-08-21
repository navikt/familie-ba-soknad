import { LocaleType } from '../../../typer/common';

export interface IFeilsideTekst {
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

export type IFeilsideTekster = Record<LocaleType, IFeilsideTekst>;
