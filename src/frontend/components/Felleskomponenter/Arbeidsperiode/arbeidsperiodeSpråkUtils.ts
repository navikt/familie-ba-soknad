import { ESvar } from '@navikt/familie-form-elements';

export const arbeidsperiodeTittelSpråkId = gjelderUtlandet =>
    gjelderUtlandet
        ? 'felles.flerearbeidsperioderutland.tittel'
        : 'felles.flerearbeidsperiodernorge.tittel';

export const tilDatoSpørsmålstekst = erPeriodeAvsluttet =>
    erPeriodeAvsluttet === ESvar.JA
        ? 'felles.nåravsluttetarbeidsperiode.spm'
        : 'felles.nåravsluttesarbeidsperiode.spm';

export const arbeidslandLabelSpråkId = (gjelderAndreForelder, erPeriodenAvsluttet) => {
    if (erPeriodenAvsluttet === ESvar.JA) {
        return gjelderAndreForelder
            ? 'enkeenkemann.andreforelder-arbeidutland.land.spm'
            : 'dinlivssituasjon.arbeid-utland.land.spm';
    } else
        return gjelderAndreForelder
            ? 'ombarnet.andre-forelder.arbeid-utland.land.spm'
            : 'omdeg.arbeid-utland.land.spm';
};

export const arbeidslandFeilmelding = (gjelderAndreForelder, erPeriodenAvsluttet) => {
    if (erPeriodenAvsluttet === ESvar.JA) {
        return gjelderAndreForelder
            ? 'enkeenkemann.andreforelder-arbeidutland.land.feilmelding'
            : 'dinlivssituasjon.arbeid-utland.land.feilmelding';
    } else
        return gjelderAndreForelder
            ? 'ombarnet.andre-forelder.arbeid-utland.land.feilmelding'
            : 'omdeg.arbeid-utland.land.feilmelding';
};

export const tilDatoArbeidsperiodeFeilmelding = erPeriodeAvsluttet =>
    erPeriodeAvsluttet === ESvar.JA
        ? 'felles.nåravsluttetarbeidsperiode.feilmelding'
        : 'felles.nåravsluttesarbeidsperiode.feilmelding';
