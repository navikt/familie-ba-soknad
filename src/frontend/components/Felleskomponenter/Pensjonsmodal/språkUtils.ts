export const pensjonslandFeilmeldingSpråkId = (
    gjelderAndreForelder,
    tilbakeITid,
    andreForelderErDød = false
) => {
    if (gjelderAndreForelder)
        return tilbakeITid || andreForelderErDød
            ? 'modal.hvilketlandpensjonandreforelder.feilmelding'
            : 'ombarnet.andre-forelder.utenlandspensjon.land.feilmelding';
    else
        return tilbakeITid
            ? 'felles.hvilketlandpensjon.feilmelding'
            : 'omdeg.utenlandspensjon.land.feilmelding';
};

export const pensjonFraDatoFeilmeldingSpråkId = (
    gjelderAndreForelder,
    tilbakeITid,
    andreForelderErDød = false
) => {
    if (gjelderAndreForelder)
        return tilbakeITid || andreForelderErDød
            ? 'modal.franårandreforelderpensjon.feilmelding'
            : 'pensjonmodal.franårpensjonandreforelder.nåtid.feilmelding';
    else
        return tilbakeITid
            ? 'felles.modal.franårfikkpensjon.feilmelding'
            : 'pensjonmodal.franårpensjon.nåtid.feilmelding';
};

export const pensjonsperiodeLeggTilFlereKnapp = (gjelderUtlandet: boolean): string =>
    gjelderUtlandet
        ? 'felles.leggtilpensjon.utland.modal.tittel'
        : 'felles.leggtilpensjon.norge.knapp';

export const pensjonsperiodeFeilmelding = (gjelderUtlandet: boolean): string =>
    gjelderUtlandet
        ? 'felles.modal.leggtilpensjonutland.feilmelding'
        : 'felles.modal.leggtilpensjonnorge.feilmelding';

export const pensjonsperiodeFlereSpørsmål = (
    gjelderUtlandet: boolean,
    gjelderAndreForelder: boolean
): string => {
    if (gjelderUtlandet) {
        return gjelderAndreForelder
            ? 'ombarnet.flerepensjonsperioder.spm'
            : 'omdeg.leggtilpensjonutland.spm';
    } else
        return gjelderAndreForelder
            ? 'eøs-om-barn.leggtilpensjonandreforelder.spm'
            : 'eøs-om-deg.leggtilpensjon.spm';
};

export const pensjonsperiodeOppsummeringOverskrift = (gjelderUtlandet: boolean): string =>
    gjelderUtlandet ? 'felles.leggtilpensjon.periode' : 'felles.leggtilpensjon.norge.modal.tittel';
