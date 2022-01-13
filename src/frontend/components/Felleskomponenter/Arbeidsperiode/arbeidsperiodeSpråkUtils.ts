import { ESvar } from '@navikt/familie-form-elements';

export const arbeidslandFeilmelding = (gjelderAndreForelder, tilbakeITid) => {
    if (tilbakeITid === ESvar.JA || tilbakeITid === null) {
        return gjelderAndreForelder
            ? 'enkeenkemann.andreforelder-arbeidutland.land.feilmelding'
            : 'dinlivssituasjon.arbeid-utland.land.feilmelding';
    } else
        return gjelderAndreForelder
            ? 'ombarnet.andre-forelder.arbeid-utland.land.feilmelding'
            : 'omdeg.arbeid-utland.land.feilmelding';
};

export const tilDatoArbeidsperiodeFeilmelding = erPeriodeAvsluttet =>
    erPeriodeAvsluttet === ESvar.JA || erPeriodeAvsluttet === null
        ? 'felles.nåravsluttetarbeidsperiode.feilmelding'
        : 'felles.nåravsluttesarbeidsperiode.feilmelding';
