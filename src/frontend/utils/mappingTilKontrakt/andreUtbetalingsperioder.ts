import { IntlShape } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import {
    hentUtbetalingsperiodeSpørsmålIder,
    UtbetalingerSpørsmålId,
} from '../../components/Felleskomponenter/UtbetalingerModal/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IUtbetalingsperiodeIKontraktFormatV7 } from '../../typer/kontrakt/v7';
import { IUtbetalingsperiode } from '../../typer/perioder';
import { barnetsNavnValue } from '../barn';
import { hentTekster, landkodeTilSpråk } from '../språk';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';

export const tilIAndreUtbetalingsperioderIKontraktFormat = ({
    periode,
    periodeNummer,
    gjelderAndreForelder,
    erAndreForelderDød,
    barn,
    intl,
}: {
    periode: IUtbetalingsperiode;
    periodeNummer: number;
    gjelderAndreForelder: boolean;
    erAndreForelderDød: boolean;
    barn?: IBarnMedISøknad;
    intl?: IntlShape;
}): ISøknadsfelt<IUtbetalingsperiodeIKontraktFormatV7> => {
    const { fårUtbetalingNå, utbetalingLand, utbetalingFraDato, utbetalingTilDato } = periode;
    const periodenErAvsluttet = fårUtbetalingNå?.svar === ESvar.NEI || erAndreForelderDød;

    const hentSpørsmålstekster = (utbetalingsSpørsmålId: string) =>
        hentTekster(
            hentUtbetalingsperiodeSpørsmålIder(gjelderAndreForelder, periodenErAvsluttet)[
                utbetalingsSpørsmålId
            ],
            { ...(barn && intl && { barn: barnetsNavnValue(barn, intl) }) }
        );
    return {
        label: hentTekster('felles.flereytelser.periode', {
            x: periodeNummer,
        }),
        verdi: sammeVerdiAlleSpråk({
            fårUtbetalingNå: {
                label: hentSpørsmålstekster(UtbetalingerSpørsmålId.fårUtbetalingNå),
                verdi: sammeVerdiAlleSpråk(fårUtbetalingNå?.svar),
            },
            utbetalingLand: {
                label: hentSpørsmålstekster(UtbetalingerSpørsmålId.utbetalingLand),
                verdi: verdiCallbackAlleSpråk(
                    locale => utbetalingLand && landkodeTilSpråk(utbetalingLand.svar, locale)
                ),
            },
            utbetalingFraDato: {
                label: hentSpørsmålstekster(UtbetalingerSpørsmålId.utbetalingFraDato),
                verdi: sammeVerdiAlleSpråk(utbetalingFraDato.svar),
            },
            utbetalingTilDato: {
                label: hentSpørsmålstekster(UtbetalingerSpørsmålId.utbetalingTilDato),
                verdi: sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                    utbetalingTilDato.svar,
                    hentUtbetalingsperiodeSpørsmålIder(gjelderAndreForelder, periodenErAvsluttet)[
                        UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke
                    ]
                ),
            },
        }),
    };
};
