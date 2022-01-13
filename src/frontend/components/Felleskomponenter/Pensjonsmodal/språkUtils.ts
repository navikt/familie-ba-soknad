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
