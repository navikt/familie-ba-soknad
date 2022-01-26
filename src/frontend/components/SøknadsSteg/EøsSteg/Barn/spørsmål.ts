export enum EøsBarnSpørsmålId {
    andreForelderPensjonNorge = 'andre-forelder-pensjon-norge',
    andreForelderPensjonNorgeEnke = 'andre-forelder-pensjon-norge-enke',
}

export const eøsBarnSpørsmålSpråkId: Record<EøsBarnSpørsmålId, string> = {
    [EøsBarnSpørsmålId.andreForelderPensjonNorge]: 'eøs-om-barn.andreforelderpensjon.spm',
    [EøsBarnSpørsmålId.andreForelderPensjonNorgeEnke]: 'enkeenkemann.andreforelderpensjon.spm',
};
