import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../SøknadsSteg/EøsSteg/Barn/spørsmål';
import {
    EøsSøkerSpørsmålId,
    eøsSøkerSpørsmålSpråkId,
} from '../../SøknadsSteg/EøsSteg/Søker/spørsmål';

export const mottarEllerMottattUtbetalingSpråkId = (
    gjelderAndreForelder: boolean,
    andreForelderErDød: boolean
): string => {
    if (gjelderAndreForelder) {
        return andreForelderErDød
            ? eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderAndreUtbetalingerEnke]
            : eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderAndreUtbetalinger];
    } else {
        return eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.utbetalinger];
    }
};

export const utbetalingerFlerePerioderSpmSpråkId = (gjelderAndreForelder: boolean) =>
    gjelderAndreForelder
        ? 'eøs-om-barn.andreforelder-utbetalinger-andreperioder.spm'
        : 'eøs-om-deg.flere-utbetalinger.spm';

export const utbetalingerFeilmelding = (gjelderAndreForelder: boolean) =>
    gjelderAndreForelder
        ? 'eøs.andreforelderutbetalinger.feilmelding'
        : 'eøs.utbetalinger.feilmelding';
