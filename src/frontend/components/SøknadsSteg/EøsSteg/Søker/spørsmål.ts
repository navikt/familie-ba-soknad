export enum EøsSøkerSpørsmålId {
    arbeidINorge = 'arbeid-i-norge',
    pensjonNorge = 'pensjon-norge',
    utbetalinger = 'utbetalinger',
    idNummer = 'id-nummer',
    adresseISøkeperiode = 'adresse-søkeperiode',
}

export const eøsSøkerSpørsmålSpråkId: Record<EøsSøkerSpørsmålId, string> = {
    [EøsSøkerSpørsmålId.arbeidINorge]: 'eøs-om-deg.arbeidsperioderinorge.spm',
    [EøsSøkerSpørsmålId.pensjonNorge]: 'eøs-om-deg.pensjoninorge.spm',
    [EøsSøkerSpørsmålId.utbetalinger]: 'eøs-om-deg.utbetalinger.spm',
    [EøsSøkerSpørsmålId.idNummer]: 'eøs-om-deg.dittidnummer.spm',
    [EøsSøkerSpørsmålId.adresseISøkeperiode]: 'eøs-om-deg.dittoppholdssted.spm',
};
