export enum UtbetalingerSpørsmålId {
    fårUtbetalingNå = 'får-utbetaling-nå',
    utbetalingLand = 'utbetaling-fra-hvilket-land',
    utbetalingFraDato = 'utbetaling-startdato',
    utbetalingTilDato = 'utbetaling-sluttdato',
    utbetalingTilDatoVetIkke = 'utbetaling-ukjent-sluttdato',
    utbetalingsperioder = 'utbetalingsperioder',
}

export const utbetalingerSøkerSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<Exclude<UtbetalingerSpørsmålId, UtbetalingerSpørsmålId.utbetalingsperioder>, string> => ({
    [UtbetalingerSpørsmålId.fårUtbetalingNå]: 'eøs.utbetalinger.spm',
    [UtbetalingerSpørsmålId.utbetalingLand]: periodenErAvsluttet
        ? 'modal.utbetalingsland-fikk-søker.spm'
        : 'modal.utbetalingsland-får-søker.spm',
    [UtbetalingerSpørsmålId.utbetalingFraDato]: 'felles.nårbegynteutbetalingene.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDato]: periodenErAvsluttet
        ? 'felles.nårstoppetutbetalingene.spm'
        : 'felles.nårstopperutbetalingene.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke]:
        'felles.vetikkenårutbetalingerstopper.sjekkboks',
});

export const utbetalingerAndreForelderSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<Exclude<UtbetalingerSpørsmålId, UtbetalingerSpørsmålId.utbetalingsperioder>, string> => ({
    [UtbetalingerSpørsmålId.fårUtbetalingNå]: 'eøs.andreforelderutbetalinger.spm',
    [UtbetalingerSpørsmålId.utbetalingLand]: periodenErAvsluttet
        ? 'modal.andreforelder-utbetalingerland-fikk.spm'
        : 'modal.andreforelder-utbetalingerland-får.spm',
    [UtbetalingerSpørsmålId.utbetalingFraDato]: 'felles.nårbegynteutbetalingene.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDato]: periodenErAvsluttet
        ? 'felles.nårstoppetutbetalingene.spm'
        : 'felles.nårstopperutbetalingene.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke]:
        'felles.vetikkenårutbetalingerstopper.sjekkboks',
});

export const hentUtbetalingsperiodeSpørsmålIder = (
    gjelderAndreForelder: boolean,
    periodenErAvsluttet: boolean
): Record<Exclude<UtbetalingerSpørsmålId, UtbetalingerSpørsmålId.utbetalingsperioder>, string> =>
    gjelderAndreForelder
        ? utbetalingerAndreForelderSpørsmålSpråkId(periodenErAvsluttet)
        : utbetalingerSøkerSpørsmålSpråkId(periodenErAvsluttet);
