import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../SøknadsSteg/EøsSteg/Barn/spørsmål';

export const mottarEllerMottattUtbetalingSpråkId = (
    gjelderAndreForelder: boolean,
    andreForelderErDød: boolean
): string => {
    if (gjelderAndreForelder) {
        return andreForelderErDød
            ? eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderAndreUtbetalingerEnke]
            : eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderAndreUtbetalinger];
    } else {
        return 'eøs-om-deg.utbetalinger.spm'; // TODO: legg inn i eøsSpråkId[SpørsmålId..] for søker
    }
};

export const utbetalingerFlerePerioderSpmSpråkId = (gjelderAndreForelder: boolean) =>
    gjelderAndreForelder
        ? 'eøs-om-barn.andreforelder-utbetalinger-andreperioder.spm'
        : 'eøs-om-deg.flere-utbetalinger.spm';
