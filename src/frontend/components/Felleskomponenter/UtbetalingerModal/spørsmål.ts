export enum UtbetalingerSpørsmålId {
    fårUtbetalingNå = 'får-utbetaling-nå',
    utbetalingLand = 'utbetaling-fra-hvilket-land',
    utbetalingFraDato = 'utbetaling-startdato',
    utbetalingTilDato = 'utbetaling-sluttdato',
    utbetalingTilDatoVetIkke = 'utbetaling-ukjent-sluttdato',
    utbetalingsperioder = 'utbetalingsperioder',
}

export const utbetalingerSøkerSpørsmålSpråkId = (
    tilbakeITid = false
): Record<Exclude<UtbetalingerSpørsmålId, UtbetalingerSpørsmålId.utbetalingsperioder>, string> => ({
    [UtbetalingerSpørsmålId.fårUtbetalingNå]: 'eøs.utbetalinger.spm',
    [UtbetalingerSpørsmålId.utbetalingLand]: tilbakeITid
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
): Record<Exclude<UtbetalingerSpørsmålId, UtbetalingerSpørsmålId.utbetalingsperioder>, string> => ({
    [UtbetalingerSpørsmålId.fårUtbetalingNå]: 'eøs.andreforelderutbetalinger.spm',
    [UtbetalingerSpørsmålId.utbetalingLand]:
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

export const hentUtbetalingsperiodeSpørsmålIder = (
    gjelderAndreForelder: boolean,
    tilbakeITid: boolean,
    erAndreForelderDød: boolean
): Record<Exclude<UtbetalingerSpørsmålId, UtbetalingerSpørsmålId.utbetalingsperioder>, string> =>
    gjelderAndreForelder
        ? utbetalingerAndreForelderSpørsmålSpråkId(tilbakeITid, erAndreForelderDød)
        : utbetalingerSøkerSpørsmålSpråkId(tilbakeITid);
