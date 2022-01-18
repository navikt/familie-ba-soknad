export const arbeidslandFeilmelding = (tilbakeITid, gjelderAndreForelder, erAndreForelderDød) => {
    if (tilbakeITid || erAndreForelderDød) {
        return gjelderAndreForelder
            ? 'enkeenkemann.andreforelder-arbeidutland.land.feilmelding'
            : 'dinlivssituasjon.arbeid-utland.land.feilmelding';
    } else
        return gjelderAndreForelder
            ? 'ombarnet.andre-forelder.arbeid-utland.land.feilmelding'
            : 'omdeg.arbeid-utland.land.feilmelding';
};

export const tilDatoArbeidsperiodeFeilmelding = (tilbakeITid, erAndreForelderDød) =>
    tilbakeITid || erAndreForelderDød
        ? 'felles.nåravsluttetarbeidsperiode.feilmelding'
        : 'felles.nåravsluttesarbeidsperiode.feilmelding';

export const arbeidsperiodeOppsummeringOverskrift = gjelderUtlandet =>
    gjelderUtlandet
        ? 'felles.flerearbeidsperioderutland.periode'
        : 'felles.flerearbeidsperiodernorge.periode';
