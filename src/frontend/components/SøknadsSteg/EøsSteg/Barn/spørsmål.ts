export enum EøsBarnSpørsmålId {
    andreForelderPensjonNorge = 'andre-forelder-pensjon-norge',
    andreForelderPensjonNorgeEnke = 'andre-forelder-pensjon-norge-enke',
    andreForelderAndreUtbetalinger = 'andre-forelder-andre-utbetalinger',
    andreForelderAndreUtbetalingerEnke = 'andre-forelder-andre-utbetalinger-enke',
}

export const eøsBarnSpørsmålSpråkId: Record<EøsBarnSpørsmålId, string> = {
    [EøsBarnSpørsmålId.andreForelderPensjonNorge]: 'eøs-om-barn.andreforelderpensjon.spm',
    [EøsBarnSpørsmålId.andreForelderPensjonNorgeEnke]: 'enkeenkemann.andreforelderpensjon.spm',
    [EøsBarnSpørsmålId.andreForelderAndreUtbetalingerEnke]: 'enkeenkemann.annenforelderytelser.spm',
    [EøsBarnSpørsmålId.andreForelderAndreUtbetalinger]: 'eøs-om-barn.andreforelderutbetalinger.spm',
};
