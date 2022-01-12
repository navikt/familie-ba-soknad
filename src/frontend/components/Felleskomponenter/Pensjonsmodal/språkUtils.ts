export const pensjonslandFeilmeldingSpråkId = (gjelderAndreForelder, tilbakeITid) => {
    if (gjelderAndreForelder)
        return tilbakeITid
            ? 'felles.hvilketlandpensjonandreforelder.feilmelding'
            : 'ombarnet.andre-forelder.utenlandspensjon.land.feilmelding';
    else
        return tilbakeITid
            ? 'felles.hvilketlandpensjon.feilmelding'
            : 'omdeg.utenlandspensjon.land.feilmelding';
};

export const pensjonFraDatoFeilmeldingSpråkId = (gjelderAndreForelder, tilbakeITid) => {
    if (gjelderAndreForelder)
        return tilbakeITid
            ? 'felles.modal.franårfikkpensjonandreforelder.feilmelding'
            : 'ombarnet.franårandreforelderpensjon.feilmelding';
    else
        return tilbakeITid
            ? 'felles.modal.franårfikkpensjon.feilmelding'
            : 'pensjonmodal.franårpensjon.nåtid.feilmelding';
};
