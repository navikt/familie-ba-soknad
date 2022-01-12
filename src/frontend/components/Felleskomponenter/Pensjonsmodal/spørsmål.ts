export enum PensjonSpørsmålId {
    mottarPensjonNå = 'mottar-pensjon-nå',
    pensjonsland = 'land-pensjon',
    fraDatoPensjon = 'fra-dato-pensjon',
    tilDatoPensjon = 'til-dato-pensjon',
}

export const pensjonSøkerSpørsmålSpråkId = (
    tilbakeITid = false
): Record<PensjonSpørsmålId, string> => ({
    [PensjonSpørsmålId.mottarPensjonNå]: 'modal.fårdupensjonnå.spm',
    [PensjonSpørsmålId.pensjonsland]: tilbakeITid
        ? 'felles.hvilketlandpensjon.spm'
        : 'omdeg.utenlandspensjon.land.spm',
    [PensjonSpørsmålId.fraDatoPensjon]: tilbakeITid
        ? 'felles.modal.franårfikkpensjon.spm'
        : 'felles.franårpensjon.spm',
    [PensjonSpørsmålId.tilDatoPensjon]: 'felles.nåravsluttetpensjon.spm',
});

export const pensjonAndreForelderSpørsmålSpråkId = (
    tilbakeITid = false
): Record<PensjonSpørsmålId, string> => ({
    [PensjonSpørsmålId.mottarPensjonNå]: 'ombarnet.andre-forelder.pensjonnå.spm',
    [PensjonSpørsmålId.pensjonsland]: tilbakeITid
        ? 'modal.hvilketlandpensjonandreforelder.spm'
        : 'ombarnet.andre-forelder.utenlandspensjon.land.spm',
    [PensjonSpørsmålId.fraDatoPensjon]: tilbakeITid
        ? 'pensjonmodal.franårpensjonandreforelder.nåtid.spm'
        : 'ombarnet.franårandreforelderpensjon.spm',
    [PensjonSpørsmålId.tilDatoPensjon]: 'felles.nåravsluttetpensjon.spm',
});
