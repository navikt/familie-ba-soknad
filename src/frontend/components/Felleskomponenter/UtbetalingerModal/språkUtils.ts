import { PersonType } from '../../../typer/personType';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../SøknadsSteg/EøsSteg/Barn/spørsmål';
import {
    EøsSøkerSpørsmålId,
    eøsSøkerSpørsmålSpråkId,
} from '../../SøknadsSteg/EøsSteg/Søker/spørsmål';
import { UtbetalingerSpørsmålId } from './spørsmål';

export const mottarEllerMottattUtbetalingSpråkId = (
    personType: PersonType,
    erDød?: boolean
): string => {
    switch (personType) {
        case PersonType.AndreForelder:
            return erDød
                ? eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderAndreUtbetalingerEnke]
                : eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderAndreUtbetalinger];
        case PersonType.Søker:
        default:
            return eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.utbetalinger];
    }
};

export const utbetalingerFlerePerioderSpmSpråkId = (personType: PersonType) => {
    switch (personType) {
        case PersonType.AndreForelder:
            return 'eøs-om-barn.andreforelder-utbetalinger-andreperioder.spm';
        case PersonType.Søker:
        default:
            return 'eøs-om-deg.flere-utbetalinger.spm';
    }
};

export const fårUtbetalingNåFeilmelding = (personType: PersonType) => {
    switch (personType) {
        case PersonType.AndreForelder:
            return 'eøs.andreforelderutbetalinger.feilmelding';
        case PersonType.Søker:
        default:
            return 'eøs.utbetalinger.feilmelding';
    }
};

export const utbetalingslandFeilmelding = (
    personType: PersonType,
    periodenErAvsluttet: boolean
) => {
    switch (personType) {
        case PersonType.AndreForelder:
            return periodenErAvsluttet
                ? 'modal.andreforelder-utbetalingerland-fikk.feilmelding'
                : 'modal.andreforelder-utbetalingerland-får.feilmelding';
        case PersonType.Søker:
        default:
            return periodenErAvsluttet
                ? 'modal.utbetalingsland-fikk-søker.feilmeldinger'
                : 'modal.utbetalingsland-får-søker.feilmelding';
    }
};
export const utbetalingerSøkerSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<Exclude<UtbetalingerSpørsmålId, UtbetalingerSpørsmålId.utbetalingsperioder>, string> => ({
    [UtbetalingerSpørsmålId.fårUtbetalingNå]: 'eøs.utbetalinger.spm',
    [UtbetalingerSpørsmålId.utbetalingLand]: periodenErAvsluttet
        ? 'modal.utbetalingsland-fikk-søker.spm'
        : 'modal.utbetalingsland-får-søker.spm',
    [UtbetalingerSpørsmålId.utbetalingFraDato]: 'felles.nårbegynteutbetalingene.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDato]: periodenErAvsluttet
        ? 'felles.nårstoppetutbetalingene.spm'
        : 'felles.nårstopperutbetalingene.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke]:
        'felles.vetikkenårutbetalingerstopper.sjekkboks',
});

export const utbetalingerAndreForelderSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<Exclude<UtbetalingerSpørsmålId, UtbetalingerSpørsmålId.utbetalingsperioder>, string> => ({
    [UtbetalingerSpørsmålId.fårUtbetalingNå]: 'eøs.andreforelderutbetalinger.spm',
    [UtbetalingerSpørsmålId.utbetalingLand]: periodenErAvsluttet
        ? 'modal.andreforelder-utbetalingerland-fikk.spm'
        : 'modal.andreforelder-utbetalingerland-får.spm',
    [UtbetalingerSpørsmålId.utbetalingFraDato]: 'felles.nårbegynteutbetalingene.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDato]: periodenErAvsluttet
        ? 'felles.nårstoppetutbetalingene.spm'
        : 'felles.nårstopperutbetalingene.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke]:
        'felles.vetikkenårutbetalingerstopper.sjekkboks',
});

export const utbetalingsperiodeModalSpørsmålSpråkIder =
    (personType: PersonType, periodenErAvsluttet: boolean) =>
    (spørsmålId: UtbetalingerSpørsmålId): string => {
        switch (personType) {
            case PersonType.AndreForelder:
                return utbetalingerAndreForelderSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
            case PersonType.Søker:
            default:
                return utbetalingerSøkerSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
        }
    };
