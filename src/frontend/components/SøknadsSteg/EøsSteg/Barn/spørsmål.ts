export enum EøsBarnSpørsmålId {
    andreForelderPensjonNorge = 'andre-forelder-pensjon-norge',
    andreForelderPensjonNorgeEnke = 'andre-forelder-pensjon-norge-enke',
    andreForelderArbeidNorge = 'andre-forelder-arbeid-norge',
    andreForelderArbeidNorgeEnke = 'andre-forelder-arbeid-norge-enke',
    andreForelderAndreUtbetalinger = 'andre-forelder-andre-utbetalinger',
    andreForelderAndreUtbetalingerEnke = 'andre-forelder-andre-utbetalinger-enke',
    idNummer = 'id-nummer',
    idNummerUkjent = 'id-nummer-ukjent',
}

export const eøsBarnSpørsmålSpråkId: Record<EøsBarnSpørsmålId, string> = {
    [EøsBarnSpørsmålId.andreForelderPensjonNorge]: 'eøs-om-barn.andreforelderpensjon.spm',
    [EøsBarnSpørsmålId.andreForelderPensjonNorgeEnke]: 'enkeenkemann.andreforelderpensjon.spm',
    [EøsBarnSpørsmålId.andreForelderArbeidNorge]:
        'eøs-om-barn.annenforelderarbeidsperiodenorge.spm',
    [EøsBarnSpørsmålId.andreForelderArbeidNorgeEnke]: 'enkeenkemann.annenforelderarbeidnorge.spm',
    [EøsBarnSpørsmålId.andreForelderAndreUtbetalingerEnke]: 'enkeenkemann.annenforelderytelser.spm',
    [EøsBarnSpørsmålId.andreForelderAndreUtbetalinger]: 'eøs-om-barn.andreforelderutbetalinger.spm',
    [EøsBarnSpørsmålId.idNummer]: 'eøs-om-barn.barnidnummer.spm',
    [EøsBarnSpørsmålId.idNummerUkjent]: 'felles.kjennerikkeidnummer.sjekkboks',
};
