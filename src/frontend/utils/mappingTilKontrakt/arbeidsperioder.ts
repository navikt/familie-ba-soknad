import { ESvar } from '@navikt/familie-form-elements';

import {
    arbeidsperiodeModalSpørsmålSpråkId,
    arbeidsperiodeOppsummeringOverskrift,
} from '../../components/Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from '../../components/Felleskomponenter/Arbeidsperiode/spørsmål';
import { AlternativtSvarForInput, ISODateString } from '../../typer/common';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IArbeidsperiodeIKontraktFormat } from '../../typer/kontrakt/v8';
import { IArbeidsperiode } from '../../typer/perioder';
import { PeriodePersonTypeProps, PersonType } from '../../typer/personType';
import { ISøknadSpørsmål } from '../../typer/spørsmål';
import { formaterDatostringKunMåned } from '../dato';
import { hentTekster, landkodeTilSpråk } from '../språk';
import { uppercaseFørsteBokstav } from '../visning';

import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

interface ArbeidsperiodeIKontraktFormatParams {
    periode: IArbeidsperiode;
    periodeNummer: number;
    gjelderUtlandet: boolean;
    toggleBeOmMånedIkkeDato: boolean;
}

export const tilIArbeidsperiodeIKontraktFormat = ({
    periode,
    periodeNummer,
    gjelderUtlandet,
    personType,
    erDød,
    toggleBeOmMånedIkkeDato,
}: ArbeidsperiodeIKontraktFormatParams &
    PeriodePersonTypeProps): ISøknadsfelt<IArbeidsperiodeIKontraktFormat> => {
    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeland,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
    } = periode;

    const periodenErAvsluttet: boolean =
        arbeidsperiodeAvsluttet?.svar === ESvar.JA ||
        (personType === PersonType.AndreForelder && erDød);

    const hentSpørsmålTekstId = arbeidsperiodeModalSpørsmålSpråkId(personType, periodenErAvsluttet);

    return {
        label: hentTekster(arbeidsperiodeOppsummeringOverskrift(gjelderUtlandet), {
            x: periodeNummer,
        }),
        verdi: sammeVerdiAlleSpråk({
            arbeidsperiodeAvsluttet: arbeidsperiodeAvsluttet.svar
                ? {
                      label: hentTekster(
                          hentSpørsmålTekstId(ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet)
                      ),
                      verdi: sammeVerdiAlleSpråk(arbeidsperiodeAvsluttet.svar),
                  }
                : null,
            arbeidsperiodeland: arbeidsperiodeland.svar
                ? {
                      label: hentTekster(
                          hentSpørsmålTekstId(ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand)
                      ),
                      verdi: verdiCallbackAlleSpråk(locale =>
                          landkodeTilSpråk(arbeidsperiodeland.svar, locale)
                      ),
                  }
                : null,
            arbeidsgiver: arbeidsgiver.svar
                ? {
                      label: hentTekster(
                          hentSpørsmålTekstId(ArbeidsperiodeSpørsmålsId.arbeidsgiver)
                      ),
                      verdi: sammeVerdiAlleSpråk(arbeidsgiver.svar),
                  }
                : null,
            fraDatoArbeidsperiode: fraDatoArbeidsperiode.svar
                ? {
                      label: hentTekster(
                          hentSpørsmålTekstId(ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode)
                      ),
                      verdi: datoTilVerdiForKontrakt(
                          toggleBeOmMånedIkkeDato,
                          fraDatoArbeidsperiode
                      ),
                  }
                : null,
            tilDatoArbeidsperiode: tilDatoArbeidsperiode.svar
                ? {
                      label: hentTekster(
                          hentSpørsmålTekstId(ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode)
                      ),
                      verdi:
                          tilDatoArbeidsperiode.svar === AlternativtSvarForInput.UKJENT
                              ? hentTekster(
                                    hentSpørsmålTekstId(
                                        ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke
                                    )
                                )
                              : datoTilVerdiForKontrakt(
                                    toggleBeOmMånedIkkeDato,
                                    tilDatoArbeidsperiode
                                ),
                  }
                : null,
        }),
    };
};

function datoTilVerdiForKontrakt(
    toggleBeOmMånedIkkeDato: boolean,
    fraDatoArbeidsperiode: ISøknadSpørsmål<ISODateString | ''>
) {
    return toggleBeOmMånedIkkeDato
        ? verdiCallbackAlleSpråk(locale =>
              uppercaseFørsteBokstav(formaterDatostringKunMåned(fraDatoArbeidsperiode.svar, locale))
          )
        : sammeVerdiAlleSpråk(fraDatoArbeidsperiode.svar);
}
