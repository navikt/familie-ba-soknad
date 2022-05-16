import { PersonType } from '../../../utils/perioder';

export enum PensjonsperiodeSpørsmålId {
    mottarPensjonNå = 'mottar-pensjon-nå',
    pensjonsland = 'land-pensjon',
    fraDatoPensjon = 'fra-dato-pensjon',
    tilDatoPensjon = 'til-dato-pensjon',
    pensjonsperioder = 'pensjonsperioder',
}

export const pensjonSøkerSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<
    Exclude<PensjonsperiodeSpørsmålId, PensjonsperiodeSpørsmålId.pensjonsperioder>,
    string
> => ({
    [PensjonsperiodeSpørsmålId.mottarPensjonNå]: 'modal.fårdupensjonnå.spm',
    [PensjonsperiodeSpørsmålId.pensjonsland]: periodenErAvsluttet
        ? 'felles.hvilketlandpensjon.spm'
        : 'omdeg.utenlandspensjon.land.spm',
    [PensjonsperiodeSpørsmålId.fraDatoPensjon]: periodenErAvsluttet
        ? 'felles.modal.franårfikkpensjon.spm'
        : 'felles.franårpensjon.spm',
    [PensjonsperiodeSpørsmålId.tilDatoPensjon]: 'felles.nåravsluttetpensjon.spm',
});

export const pensjonAndreForelderSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<
    Exclude<PensjonsperiodeSpørsmålId, PensjonsperiodeSpørsmålId.pensjonsperioder>,
    string
> => ({
    [PensjonsperiodeSpørsmålId.mottarPensjonNå]: 'ombarnet.andre-forelder.pensjonnå.spm',
    [PensjonsperiodeSpørsmålId.pensjonsland]: periodenErAvsluttet
        ? 'modal.hvilketlandpensjonandreforelder.spm'
        : 'ombarnet.andre-forelder.utenlandspensjon.land.spm',
    [PensjonsperiodeSpørsmålId.fraDatoPensjon]: periodenErAvsluttet
        ? 'modal.franårandreforelderpensjon.spm'
        : 'pensjonmodal.franårpensjonandreforelder.nåtid.spm',
    [PensjonsperiodeSpørsmålId.tilDatoPensjon]: 'felles.nåravsluttetpensjon.spm',
});

export const hentPensjonsperiodeSpørsmålIder = (
    personType: PersonType,
    periodenErAvsluttet: boolean
): Record<
    Exclude<PensjonsperiodeSpørsmålId, PensjonsperiodeSpørsmålId.pensjonsperioder>,
    string
> => {
    switch (personType) {
        case PersonType.AndreForelder:
            return pensjonAndreForelderSpørsmålSpråkId(periodenErAvsluttet);
        case PersonType.Søker:
        default:
            return pensjonSøkerSpørsmålSpråkId(periodenErAvsluttet);
    }
};
