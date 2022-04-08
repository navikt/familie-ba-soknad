export enum PensjonSpørsmålId {
    mottarPensjonNå = 'mottar-pensjon-nå',
    pensjonsland = 'land-pensjon',
    fraDatoPensjon = 'fra-dato-pensjon',
    tilDatoPensjon = 'til-dato-pensjon',
    pensjonsperioder = 'pensjonsperioder',
}

export const pensjonSøkerSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<Exclude<PensjonSpørsmålId, PensjonSpørsmålId.pensjonsperioder>, string> => ({
    [PensjonSpørsmålId.mottarPensjonNå]: 'modal.fårdupensjonnå.spm',
    [PensjonSpørsmålId.pensjonsland]: periodenErAvsluttet
        ? 'felles.hvilketlandpensjon.spm'
        : 'omdeg.utenlandspensjon.land.spm',
    [PensjonSpørsmålId.fraDatoPensjon]: periodenErAvsluttet
        ? 'felles.modal.franårfikkpensjon.spm'
        : 'felles.franårpensjon.spm',
    [PensjonSpørsmålId.tilDatoPensjon]: 'felles.nåravsluttetpensjon.spm',
});

export const pensjonAndreForelderSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<Exclude<PensjonSpørsmålId, PensjonSpørsmålId.pensjonsperioder>, string> => ({
    [PensjonSpørsmålId.mottarPensjonNå]: 'ombarnet.andre-forelder.pensjonnå.spm',
    [PensjonSpørsmålId.pensjonsland]: periodenErAvsluttet
        ? 'modal.hvilketlandpensjonandreforelder.spm'
        : 'ombarnet.andre-forelder.utenlandspensjon.land.spm',
    [PensjonSpørsmålId.fraDatoPensjon]: periodenErAvsluttet
        ? 'modal.franårandreforelderpensjon.spm'
        : 'pensjonmodal.franårpensjonandreforelder.nåtid.spm',
    [PensjonSpørsmålId.tilDatoPensjon]: 'felles.nåravsluttetpensjon.spm',
});

export const hentPensjonsperiodeSpørsmålIder = (
    gjelderAndreForelder: boolean,
    periodenErAvsluttet: boolean
): Record<Exclude<PensjonSpørsmålId, PensjonSpørsmålId.pensjonsperioder>, string> =>
    gjelderAndreForelder
        ? pensjonAndreForelderSpørsmålSpråkId(periodenErAvsluttet)
        : pensjonSøkerSpørsmålSpråkId(periodenErAvsluttet);
