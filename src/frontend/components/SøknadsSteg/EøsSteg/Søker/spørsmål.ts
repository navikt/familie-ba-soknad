export enum EøsSøkerSpørsmålId {
    arbeidINorge = 'arbeid-i-norge',
    pensjonNorge = 'pensjon-norge',
    utbetalinger = 'utbetalinger',
}

export const eøsSøkerSpørsmålSpråkId: Record<EøsSøkerSpørsmålId, string> = {
    [EøsSøkerSpørsmålId.arbeidINorge]: 'eøs-om-deg.arbeidsperioderinorge.spm',
    [EøsSøkerSpørsmålId.pensjonNorge]: 'eøs-om-deg.pensjoninorge.spm',
    [EøsSøkerSpørsmålId.utbetalinger]: 'eøs-om-deg.utbetalinger.spm',
};
