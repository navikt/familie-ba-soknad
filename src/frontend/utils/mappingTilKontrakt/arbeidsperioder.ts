import { ESvar } from '@navikt/familie-form-elements';

import {
    arbeidsperiodeModalSpørsmålSpråkId,
    arbeidsperiodeOppsummeringOverskrift,
} from '../../components/Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from '../../components/Felleskomponenter/Arbeidsperiode/spørsmål';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IArbeidsperiodeIKontraktFormat } from '../../typer/kontrakt/v8';
import { IArbeidsperiode } from '../../typer/perioder';
import { PeriodePersonTypeProps, PersonType } from '../../typer/personType';
import { hentTekster, landkodeTilSpråk } from '../språk';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';

interface ArbeidsperiodeIKontraktFormatParams {
    periode: IArbeidsperiode;
    periodeNummer: number;
    gjelderUtlandet: boolean;
}

export const tilIArbeidsperiodeIKontraktFormat = ({
    periode,
    periodeNummer,
    gjelderUtlandet,
    personType,
    erDød,
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
            arbeidsperiodeAvsluttet: {
                label: hentTekster(
                    hentSpørsmålTekstId(ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet)
                ),
                verdi: sammeVerdiAlleSpråk(arbeidsperiodeAvsluttet?.svar ?? null),
            },
            arbeidsperiodeland: {
                label: hentTekster(
                    hentSpørsmålTekstId(ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand)
                ),
                verdi: verdiCallbackAlleSpråk(locale =>
                    arbeidsperiodeland ? landkodeTilSpråk(arbeidsperiodeland.svar, locale) : null
                ),
            },
            arbeidsgiver: {
                label: hentTekster(hentSpørsmålTekstId(ArbeidsperiodeSpørsmålsId.arbeidsgiver)),
                verdi: sammeVerdiAlleSpråk(arbeidsgiver?.svar ?? null),
            },
            fraDatoArbeidsperiode: {
                label: hentTekster(
                    hentSpørsmålTekstId(ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode)
                ),
                verdi: sammeVerdiAlleSpråk(fraDatoArbeidsperiode?.svar ?? null),
            },
            tilDatoArbeidsperiode: {
                label: hentTekster(
                    hentSpørsmålTekstId(ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode)
                ),
                verdi: sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                    tilDatoArbeidsperiode?.svar ?? null,
                    hentSpørsmålTekstId(ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke)
                ),
            },
        }),
    };
};
