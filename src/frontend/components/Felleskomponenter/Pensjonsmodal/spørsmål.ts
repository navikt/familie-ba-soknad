export enum PensjonSpørsmålId {
    mottarPensjonNå = 'mottar-pensjon-nå',
    pensjonsland = 'land-pensjon',
    fraDatoPensjon = 'fra-dato-pensjon',
    tilDatoPensjon = 'til-dato-pensjon',
    pensjonsperioder = 'pensjonsperioder',
}

export const pensjonSøkerSpørsmålSpråkId = (
    tilbakeITid = false
): Record<Exclude<PensjonSpørsmålId, PensjonSpørsmålId.pensjonsperioder>, string> => ({
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
    tilbakeITid = false,
    erDød = false
): Record<Exclude<PensjonSpørsmålId, PensjonSpørsmålId.pensjonsperioder>, string> => ({
    [PensjonSpørsmålId.mottarPensjonNå]: 'ombarnet.andre-forelder.pensjonnå.spm',
    [PensjonSpørsmålId.pensjonsland]:
        tilbakeITid || erDød
            ? 'modal.hvilketlandpensjonandreforelder.spm'
            : 'ombarnet.andre-forelder.utenlandspensjon.land.spm',
    [PensjonSpørsmålId.fraDatoPensjon]:
        tilbakeITid || erDød
            ? 'modal.franårandreforelderpensjon.spm'
            : 'pensjonmodal.franårpensjonandreforelder.nåtid.spm',
    [PensjonSpørsmålId.tilDatoPensjon]: 'felles.nåravsluttetpensjon.spm',
});
