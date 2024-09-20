import { IVedleggOppsummering } from './vedleggOppsummeringTypes';

export const hentVedleggSomSkalVises = (
    vedlegg: IVedleggOppsummering[]
): IVedleggOppsummering[] => {
    return vedlegg.filter(enkeltVedlegg => enkeltVedlegg.skalVises);
};

export const skalVedleggOppsummeringVises = (vedlegg: IVedleggOppsummering[]): boolean => {
    return vedlegg.filter(enkeltVedlegg => enkeltVedlegg.skalVises).length > 0;
};
