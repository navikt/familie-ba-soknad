import { ESvar } from '@navikt/familie-form-elements';

import { arbeidsperiodeOppsummeringOverskrift } from '../../components/Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import {
    ArbeidsperiodeSpørsmålsId,
    arbeidsperiodeSpørsmålSpråkId,
} from '../../components/Felleskomponenter/Arbeidsperiode/spørsmål';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IArbeidsperiodeIKontraktFormat } from '../../typer/kontrakt/v7';
import { IArbeidsperiode } from '../../typer/perioder';
import { hentTekster, landkodeTilSpråk } from '../språk';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';

export const tilIArbeidsperiodeIKontraktFormat = ({
    periode,
    periodeNummer,
    gjelderUtlandet,
    gjelderAndreForelder,
    erAndreForelderDød,
}: {
    periode: IArbeidsperiode;
    periodeNummer: number;
    gjelderUtlandet: boolean;
    gjelderAndreForelder: boolean;
    erAndreForelderDød: boolean;
}): ISøknadsfelt<IArbeidsperiodeIKontraktFormat> => {
    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeland,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
    } = periode;
    const tilbakeITid = arbeidsperiodeAvsluttet?.svar === ESvar.JA;

    const hentSpørsmålTekstId = arbeidsperiodeSpørsmålSpråkId(
        gjelderAndreForelder,
        tilbakeITid,
        erAndreForelderDød
    );
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
