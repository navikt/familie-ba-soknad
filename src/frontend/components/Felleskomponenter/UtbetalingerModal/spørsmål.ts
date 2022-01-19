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
        ? 'modal.utbetalingsland-fikk-søker.spm'
        : 'modal.utbetalingsland-får-søker.spm',
    [UtbetalingerSpørsmålId.utbetalingFraDato]: 'felles.nårbegynteutbetalingene.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDato]: tilbakeITid
        ? 'felles.nårstoppetutbetalingene.spm'
        : 'felles.nårstopperutbetalingene.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke]:
        'felles.vetikkenårutbetalingerstopper.sjekkboks',
});

export const utbetalingerAndreForelderSpørsmålSpråkId = (
    tilbakeITid = false,
    andreForelderErDød = false
): Record<UtbetalingerSpørsmålId, string> => ({
    [UtbetalingerSpørsmålId.fårUtbetalingNå]: 'eøs.andreforelderutbetalinger.spm',
    [UtbetalingerSpørsmålId.utbetalingFraHvilketLand]:
        tilbakeITid || andreForelderErDød
            ? 'modal.andreforelder-utbetalingerland-fikk.spm'
            : 'modal.andreforelder-utbetalingerland-får.spm',
    [UtbetalingerSpørsmålId.utbetalingFraDato]: 'felles.nårbegynteutbetalingene.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDato]:
        tilbakeITid || andreForelderErDød
            ? 'felles.nårstoppetutbetalingene.spm'
            : 'felles.nårstopperutbetalingene.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke]:
        'felles.vetikkenårutbetalingerstopper.sjekkboks',
});
