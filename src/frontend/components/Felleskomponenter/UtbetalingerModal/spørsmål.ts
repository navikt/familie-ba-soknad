export enum UtbetalingerSpørsmålId {
    fårUtbetalingNå = 'får-utbetaling-nå',
}

export const utbetalingerSøkerSpørsmålSpråkId: Record<UtbetalingerSpørsmålId, string> = {
    [UtbetalingerSpørsmålId.fårUtbetalingNå]: 'eøs.utbetalinger.spm',
};

export const utbetalingerAndreForelderSpørsmålSpråkId: Record<UtbetalingerSpørsmålId, string> = {
    [UtbetalingerSpørsmålId.fårUtbetalingNå]: 'eøs.andreforelderutbetalinger.spm',
};
