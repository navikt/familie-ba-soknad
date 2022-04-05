import {
    DinLivssituasjonSpørsmålId,
    dinLivssituasjonSpørsmålSpråkId,
} from '../../SøknadsSteg/DinLivssituasjon/spørsmål';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../SøknadsSteg/EøsSteg/Barn/spørsmål';
import {
    EøsSøkerSpørsmålId,
    eøsSøkerSpørsmålSpråkId,
} from '../../SøknadsSteg/EøsSteg/Søker/spørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../SøknadsSteg/OmBarnet/spørsmål';

export const arbeidslandFeilmelding = (
    tilbakeITid: boolean,
    gjelderAndreForelder: boolean
): string => {
    if (tilbakeITid) {
        return gjelderAndreForelder
            ? 'enkeenkemann.andreforelder-arbeidutland.land.feilmelding'
            : 'dinlivssituasjon.arbeid-utland.land.feilmelding';
    } else
        return gjelderAndreForelder
            ? 'ombarnet.andre-forelder.arbeid-utland.land.feilmelding'
            : 'omdeg.arbeid-utland.land.feilmelding';
};

export const tilDatoArbeidsperiodeFeilmelding = (tilbakeITid: boolean): string =>
    tilbakeITid
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

export const arbeidsperiodeSpørsmålSpråkId = (
    gjelderUtlandet: boolean,
    gjelderAndreForelder: boolean,
    andreForelderErDød: boolean
): string => {
    if (gjelderAndreForelder) {
        if (andreForelderErDød) {
            return gjelderUtlandet
                ? omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderArbeidUtlandetEnke]
                : eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderArbeidNorgeEnke];
        } else {
            return gjelderUtlandet
                ? omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderArbeidUtlandet]
                : eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderArbeidNorge];
        }
    } else {
        return gjelderUtlandet
            ? dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.jobberPåBåt]
            : eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.arbeidINorge];
    }
};
