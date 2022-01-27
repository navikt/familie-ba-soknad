import {
    DinLivssituasjonSpørsmålId,
    dinLivssituasjonSpørsmålSpråkId,
} from '../../SøknadsSteg/DinLivssituasjon/spørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../SøknadsSteg/OmBarnet/spørsmål';

export const arbeidslandFeilmelding = (
    tilbakeITid: boolean,
    gjelderAndreForelder: boolean,
    erAndreForelderDød: boolean
): string => {
    if (tilbakeITid || erAndreForelderDød) {
        return gjelderAndreForelder
            ? 'enkeenkemann.andreforelder-arbeidutland.land.feilmelding'
            : 'dinlivssituasjon.arbeid-utland.land.feilmelding';
    } else
        return gjelderAndreForelder
            ? 'ombarnet.andre-forelder.arbeid-utland.land.feilmelding'
            : 'omdeg.arbeid-utland.land.feilmelding';
};

export const tilDatoArbeidsperiodeFeilmelding = (
    tilbakeITid: boolean,
    erAndreForelderDød: boolean
): string =>
    tilbakeITid || erAndreForelderDød
        ? 'felles.nåravsluttetarbeidsperiode.feilmelding'
        : 'felles.nåravsluttesarbeidsperiode.feilmelding';

export const arbeidsperiodeOppsummeringOverskrift = (gjelderUtlandet: boolean): string =>
    gjelderUtlandet
        ? 'felles.flerearbeidsperioderutland.periode'
        : 'felles.flerearbeidsperiodernorge.periode';

export const arbeidsperiodeLeggTilFlereKnapp = (gjelderUtlandet: boolean): string =>
    gjelderUtlandet
        ? 'felles.flerearbeidsperioderutland.tittel'
        : 'felles.flerearbeidsperiodernorge.tittel';

export const arbeidsperiodeFlereSpørsmål = (
    gjelderUtlandet: boolean,
    gjelderAndreForelder: boolean
): string => {
    if (gjelderUtlandet) {
        return gjelderAndreForelder
            ? 'eøs.andre-forelder.arbeid-utland-perioder.spm'
            : 'eøs.arbeid-utland-perioder.spm';
    } else
        return gjelderAndreForelder
            ? 'eøs-om-barn.annenforelderflerearbeidsperiodenorge.spm'
            : 'eøs-om-deg.flerearbeidsperioderinorge.spm';
};

export const arbeidsperiodeFeilmelding = (gjelderUtlandet: boolean): string =>
    gjelderUtlandet
        ? 'felles.flerearbeidsperioderutland.feilmelding'
        : 'felles.flerearbeidsperiodernorge.feilmelding';

export const arbeidsperiodeSpørsmålSpråkId = (gjelderAndreForelder: boolean) => {
    if (gjelderAndreForelder) {
        return omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderArbeidUtlandet];
    } else {
        return dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.jobberPåBåt];
    }
};
