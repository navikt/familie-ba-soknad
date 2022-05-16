import { PersonType } from '../../../utils/perioder';
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
    periodenErAvsluttet: boolean,
    personType: PersonType
): string => {
    switch (personType) {
        case PersonType.AndreForelder: {
            return periodenErAvsluttet
                ? 'enkeenkemann.andreforelder-arbeidutland.land.feilmelding'
                : 'ombarnet.andre-forelder.arbeid-utland.land.feilmelding';
        }
        case PersonType.Omsorgsperson: {
            return periodenErAvsluttet
                ? 'modal.omsorgsperson-arbeid-utland.land-fortid.feilmelding'
                : 'modal.omsorgsperson-arbeid-utland.land-nåtid.feilmelding';
        }
        case PersonType.Søker:
        default:
            return periodenErAvsluttet
                ? 'dinlivssituasjon.arbeid-utland.land.feilmelding'
                : 'omdeg.arbeid-utland.land.feilmelding';
    }
};

export const tilDatoArbeidsperiodeFeilmelding = (periodenErAvsluttet: boolean): string =>
    periodenErAvsluttet
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
    personType: PersonType
): string => {
    switch (personType) {
        case PersonType.AndreForelder:
            return gjelderUtlandet
                ? 'eøs.andre-forelder.arbeid-utland-perioder.spm'
                : 'eøs-om-barn.annenforelderflerearbeidsperiodenorge.spm';
        case PersonType.Omsorgsperson:
            return gjelderUtlandet
                ? 'eøs-om-barn.omsorgsperson-arbeid-utland-perioder.spm'
                : 'eøs-om-barn.omsorgspersonflerearbeidsperiodenorge.spm';
        case PersonType.Søker:
        default:
            return gjelderUtlandet
                ? 'eøs.arbeid-utland-perioder.spm'
                : 'eøs-om-deg.flerearbeidsperioderinorge.spm';
    }
};

export const arbeidsperiodeFeilmelding = (gjelderUtlandet: boolean): string =>
    gjelderUtlandet
        ? 'felles.flerearbeidsperioderutland.feilmelding'
        : 'felles.flerearbeidsperiodernorge.feilmelding';

export const arbeidsperiodeSpørsmålSpråkId = (
    gjelderUtlandet: boolean,
    personType: PersonType,
    erDød?: boolean
): string => {
    switch (personType) {
        case PersonType.AndreForelder: {
            if (erDød) {
                return gjelderUtlandet
                    ? omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderArbeidUtlandetEnke]
                    : eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderArbeidNorgeEnke];
            } else {
                return gjelderUtlandet
                    ? omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderArbeidUtlandet]
                    : eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderArbeidNorge];
            }
        }
        case PersonType.Omsorgsperson: {
            return gjelderUtlandet
                ? eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonArbeidUtland]
                : eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonArbeidNorge];
        }
        case PersonType.Søker:
        default:
            return gjelderUtlandet
                ? dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.jobberPåBåt]
                : eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.arbeidINorge];
    }
};
