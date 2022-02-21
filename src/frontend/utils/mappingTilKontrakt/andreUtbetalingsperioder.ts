import { IntlShape } from 'react-intl';

import {
    hentUtbetalingsperiodeSpørsmålIder,
    UtbetalingerSpørsmålId,
} from '../../components/Felleskomponenter/UtbetalingerModal/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IUtbetalingsperiodeIKontraktFormat7 } from '../../typer/kontrakt/v7';
import { IUtbetalingsperiode } from '../../typer/perioder';
import { barnetsNavnValue } from '../barn';
import { hentTekster, landkodeTilSpråk } from '../språk';
import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

export const tilIAndreUtbetalingsperioderIKontraktFormat = ({
    periode,
    periodeNummer,
    tilbakeITid,
    gjelderAndreForelder,
    erAndreForelderDød,
    barn,
    intl,
}: {
    periode: IUtbetalingsperiode;
    periodeNummer: number;
    tilbakeITid: boolean;
    gjelderAndreForelder: boolean;
    erAndreForelderDød: boolean;
    barn?: IBarnMedISøknad;
    intl?: IntlShape;
}): ISøknadsfelt<IUtbetalingsperiodeIKontraktFormat7> => {
    const { fårUtbetalingNå, utbetalingLand, utbetalingFraDato, utbetalingTilDato } = periode;

    return {
        label: hentTekster('felles.flereytelser.periode', {
            x: periodeNummer,
        }),
        verdi: sammeVerdiAlleSpråk({
            fårUtbetalingNå: {
                label: hentTekster(
                    hentUtbetalingsperiodeSpørsmålIder(
                        gjelderAndreForelder,
                        tilbakeITid,
                        erAndreForelderDød
                    )[UtbetalingerSpørsmålId.fårUtbetalingNå],
                    { ...(barn && intl && { barn: barnetsNavnValue(barn, intl) }) }
                ),
                verdi: sammeVerdiAlleSpråk(fårUtbetalingNå?.svar),
            },
            utbetalingLand: {
                label: hentTekster(
                    hentUtbetalingsperiodeSpørsmålIder(
                        gjelderAndreForelder,
                        tilbakeITid,
                        erAndreForelderDød
                    )[UtbetalingerSpørsmålId.utbetalingLand],
                    { ...(barn && intl && { barn: barnetsNavnValue(barn, intl) }) }
                ),
                verdi: verdiCallbackAlleSpråk(
                    locale => utbetalingLand && landkodeTilSpråk(utbetalingLand.svar, locale)
                ),
            },
            utbetalingFraDato: {
                label: hentTekster(
                    hentUtbetalingsperiodeSpørsmålIder(
                        gjelderAndreForelder,
                        tilbakeITid,
                        erAndreForelderDød
                    )[UtbetalingerSpørsmålId.utbetalingFraDato]
                ),
                verdi: sammeVerdiAlleSpråk(utbetalingFraDato?.svar),
            },
            utbetalingTilDato: {
                label: hentTekster(
                    hentUtbetalingsperiodeSpørsmålIder(
                        gjelderAndreForelder,
                        tilbakeITid,
                        erAndreForelderDød
                    )[UtbetalingerSpørsmålId.utbetalingTilDato]
                ),
                verdi: sammeVerdiAlleSpråk(utbetalingTilDato?.svar),
            },
        }),
    };
};
