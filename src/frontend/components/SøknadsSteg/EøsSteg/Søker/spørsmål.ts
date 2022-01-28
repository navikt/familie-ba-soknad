export enum EøsSøkerSpørsmålId {
    arbeidINorge = 'arbeid-i-norge',
    pensjonNorge = 'pensjon-norge',
}

export const eøsSøkerSpørsmålSpråkId: Record<EøsSøkerSpørsmålId, string> = {
    [EøsSøkerSpørsmålId.arbeidINorge]: 'eøs-om-deg.arbeidsperioderinorge.spm',
    [EøsSøkerSpørsmålId.pensjonNorge]: 'eøs-om-deg.pensjoninorge.spm',
};
