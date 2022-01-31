import { arbeidsperiodeOppsummeringOverskrift } from '../../components/Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import {
    arbeidsperiodeSpråkId,
    ArbeidsperiodeSpørsmålsId,
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
    tilbakeITid,
    erAndreForelderDød,
}: {
    periode: IArbeidsperiode;
    periodeNummer: number;
    gjelderUtlandet: boolean;
    gjelderAndreForelder: boolean;
    tilbakeITid: boolean;
    erAndreForelderDød: boolean;
}): ISøknadsfelt<IArbeidsperiodeIKontraktFormat> => {
    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeland,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
    } = periode;
    const språkId: (spørsmålId: ArbeidsperiodeSpørsmålsId) => string = arbeidsperiodeSpråkId(
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
                label: hentTekster(språkId(ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet)),
                verdi: sammeVerdiAlleSpråk(arbeidsperiodeAvsluttet?.svar),
            },
            arbeidsperiodeland: {
                label: hentTekster(språkId(ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand)),
                verdi: verdiCallbackAlleSpråk(
                    locale =>
                        arbeidsperiodeland && landkodeTilSpråk(arbeidsperiodeland.svar, locale)
                ),
            },
            arbeidsgiver: {
                label: hentTekster(språkId(ArbeidsperiodeSpørsmålsId.arbeidsgiver)),
                verdi: sammeVerdiAlleSpråk(arbeidsgiver?.svar),
            },
            fraDatoArbeidsperiode: {
                label: hentTekster(språkId(ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode)),
                verdi: sammeVerdiAlleSpråk(fraDatoArbeidsperiode?.svar),
            },
            tilDatoArbeidsperiode: {
                label: hentTekster(språkId(ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode)),
                verdi: sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                    tilDatoArbeidsperiode?.svar,
                    'felles.vetikkenåravsluttes.spm'
                ),
            },
        }),
    };
};
