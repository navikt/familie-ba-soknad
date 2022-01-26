export enum EøsBarnSpørsmålsId {
    andreForelderPensjonNorge = 'andre-forelder-pensjon-norge',
    andreForelderPensjonNorgeEnke = 'andre-forelder-pensjon-norge-enke',
}

export const eøsBarnSpørsmålSpråkId: Record<EøsBarnSpørsmålsId, string> = {
    [EøsBarnSpørsmålsId.andreForelderPensjonNorge]: 'eøs-om-barn.andreforelderpensjon.spm',
    [EøsBarnSpørsmålsId.andreForelderPensjonNorgeEnke]: 'enkeenkemann.andreforelderpensjon.spm',
};
