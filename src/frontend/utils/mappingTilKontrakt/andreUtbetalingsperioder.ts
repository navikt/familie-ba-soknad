import { ESvar } from '@navikt/familie-form-elements';

import { utbetalingsperiodeModalSpørsmålSpråkIder } from '../../components/Felleskomponenter/UtbetalingerModal/språkUtils';
import { UtbetalingerSpørsmålId } from '../../components/Felleskomponenter/UtbetalingerModal/spørsmål';
import { useFeatureToggles } from '../../context/FeatureToggleContext';
import { AlternativtSvarForInput, ISODateString } from '../../typer/common';
import { EFeatureToggle } from '../../typer/feature-toggles';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IUtbetalingsperiodeIKontraktFormatV8 } from '../../typer/kontrakt/v8';
import { IUtbetalingsperiode } from '../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../typer/personType';
import { ISøknadSpørsmål } from '../../typer/spørsmål';
import { formaterDatostringKunMåned } from '../dato';
import { hentTekster, landkodeTilSpråk } from '../språk';
import { uppercaseFørsteBokstav } from '../visning';

import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

interface UtbetalingsperiodeIKontraktFormatParams {
    periode: IUtbetalingsperiode;
    periodeNummer: number;
}

export const tilIAndreUtbetalingsperioderIKontraktFormat = ({
    periode,
    periodeNummer,
    personType,
    erDød,
    barn,
}: UtbetalingsperiodeIKontraktFormatParams &
    PeriodePersonTypeMedBarnProps): ISøknadsfelt<IUtbetalingsperiodeIKontraktFormatV8> => {
    const { fårUtbetalingNå, utbetalingLand, utbetalingFraDato, utbetalingTilDato } = periode;
    const periodenErAvsluttet =
        fårUtbetalingNå?.svar === ESvar.NEI || (personType === PersonType.AndreForelder && erDød);

    const { toggles } = useFeatureToggles();

    const hentUtbetalingsperiodeSpråkId = utbetalingsperiodeModalSpørsmålSpråkIder(
        personType,
        periodenErAvsluttet
    );

    const hentSpørsmålstekster = (utbetalingsSpørsmålId: UtbetalingerSpørsmålId) =>
        hentTekster(hentUtbetalingsperiodeSpråkId(utbetalingsSpørsmålId), {
            ...(barn && { barn: barn.navn }),
        });
    return {
        label: hentTekster('felles.flereytelser.periode', {
            x: periodeNummer,
        }),
        verdi: sammeVerdiAlleSpråk({
            fårUtbetalingNå: fårUtbetalingNå.svar
                ? {
                      label: hentSpørsmålstekster(UtbetalingerSpørsmålId.fårUtbetalingNå),
                      verdi: sammeVerdiAlleSpråk(fårUtbetalingNå.svar),
                  }
                : null,
            utbetalingLand: {
                label: hentSpørsmålstekster(UtbetalingerSpørsmålId.utbetalingLand),
                verdi: verdiCallbackAlleSpråk(
                    locale => utbetalingLand && landkodeTilSpråk(utbetalingLand.svar, locale)
                ),
            },
            utbetalingFraDato: {
                label: hentSpørsmålstekster(UtbetalingerSpørsmålId.utbetalingFraDato),
                verdi: datoTilVerdiForKontrakt(utbetalingFraDato),
            },
            utbetalingTilDato: {
                label: hentSpørsmålstekster(UtbetalingerSpørsmålId.utbetalingTilDato),
                verdi:
                    utbetalingTilDato.svar === AlternativtSvarForInput.UKJENT
                        ? hentTekster(
                              hentUtbetalingsperiodeSpråkId(
                                  UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke
                              )
                          )
                        : datoTilVerdiForKontrakt(utbetalingTilDato),
            },
        }),
    };

    function datoTilVerdiForKontrakt(fraDatoArbeidsperiode: ISøknadSpørsmål<ISODateString | ''>) {
        return toggles[EFeatureToggle.BE_OM_MÅNED_IKKE_DATO]
            ? verdiCallbackAlleSpråk(locale =>
                  uppercaseFørsteBokstav(
                      formaterDatostringKunMåned(fraDatoArbeidsperiode.svar, locale)
                  )
              )
            : sammeVerdiAlleSpråk(fraDatoArbeidsperiode.svar);
    }
};
