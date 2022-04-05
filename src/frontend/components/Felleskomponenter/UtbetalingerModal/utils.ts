import { ISODateString } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import {
    dagenEtterDato,
    dagensDato,
    erSammeDatoSomDagensDato,
    morgendagensDato,
} from '../../../utils/dato';
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

export const utbetalingerFeilmelding = (gjelderAndreForelder: boolean) =>
    gjelderAndreForelder
        ? 'eøs.andreforelderutbetalinger.feilmelding'
        : 'eøs.utbetalinger.feilmelding';

export const minAvgrensningUtbetalingTilDato = (
    tilbakeITid: boolean,
    utbetalingFraDato: Felt<ISODateString>
) => {
    if (tilbakeITid) {
        return dagenEtterDato(utbetalingFraDato.verdi);
    } else if (erSammeDatoSomDagensDato(utbetalingFraDato.verdi)) {
        return morgendagensDato();
    } else {
        return dagensDato();
    }
};
