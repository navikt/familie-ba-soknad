export enum UtbetalingerSpørsmålId {
    fårUtbetalingNå = 'får-utbetaling-nå',
    utbetalingFraHvilketLand = 'utbetaling-fra-hvilket-land',
    utbetalingFraDato = 'utbetaling-startdato',
    utbetalingTilDato = 'utbetaling-sluttdato',
    utbetalingTilDatoVetIkke = 'utbetaling-ukjent-sluttdato',
}

export const utbetalingerSøkerSpørsmålSpråkId = (
    tilbakeITid = false
): Record<UtbetalingerSpørsmålId, string> => ({
    [UtbetalingerSpørsmålId.fårUtbetalingNå]: 'eøs.utbetalinger.spm',
    [UtbetalingerSpørsmålId.utbetalingFraHvilketLand]: tilbakeITid
        ? 'modal.ytselseslandfortid.spm'
        : 'eøs.ytselseland.spm',
    [UtbetalingerSpørsmålId.utbetalingFraDato]: 'felles.nårbegynteytelsen.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDato]: tilbakeITid
        ? 'felles.nårytelsenavsluttet.spm'
        : 'felles.nåravsluttesytelsen.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke]: 'felles.svaralternativ.vetikke',
});

export const utbetalingerAndreForelderSpørsmålSpråkId = (
    tilbakeITid = false
): Record<UtbetalingerSpørsmålId, string> => ({
    [UtbetalingerSpørsmålId.fårUtbetalingNå]: 'eøs.andreforelderutbetalinger.spm',
    [UtbetalingerSpørsmålId.utbetalingFraHvilketLand]: tilbakeITid
        ? 'modal.andreforelderytselselandfortid.spm'
        : 'eøs.andreforelderytselseland.spm',
    [UtbetalingerSpørsmålId.utbetalingFraDato]: 'felles.nårbegynteytelsen.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDato]: tilbakeITid
        ? 'felles.nårytelsenavsluttet.spm'
        : 'felles.nåravsluttesytelsen.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke]: 'felles.svaralternativ.vetikke',
});
