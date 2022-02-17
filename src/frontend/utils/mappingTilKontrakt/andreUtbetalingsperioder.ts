import {
    hentUtbetalingsperiodeSpørsmålIder,
    UtbetalingerSpørsmålId,
} from '../../components/Felleskomponenter/UtbetalingerModal/spørsmål';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IUtbetalingsperiodeIKontraktFormat7 } from '../../typer/kontrakt/v7';
import { IUtbetalingsperiode } from '../../typer/perioder';
import { hentTekster, landkodeTilSpråk } from '../språk';
import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

export const tilIAndreUtbetalingsperioderIKontraktFormat = ({
    periode,
    periodeNummer,
    tilbakeITid,
    gjelderAndreForelder,
    erAndreForelderDød,
}: {
    periode: IUtbetalingsperiode;
    periodeNummer: number;
    tilbakeITid: boolean;
    gjelderAndreForelder: boolean;
    erAndreForelderDød: boolean;
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
                    )[UtbetalingerSpørsmålId.fårUtbetalingNå]
                ),
                verdi: sammeVerdiAlleSpråk(fårUtbetalingNå?.svar),
            },
            utbetalingLand: {
                label: hentTekster(
                    hentUtbetalingsperiodeSpørsmålIder(
                        gjelderAndreForelder,
                        tilbakeITid,
                        erAndreForelderDød
                    )[UtbetalingerSpørsmålId.utbetalingLand]
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
