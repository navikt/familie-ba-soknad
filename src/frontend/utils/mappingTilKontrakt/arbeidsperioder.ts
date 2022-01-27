import { arbeidsperiodeOppsummeringOverskrift } from '../../components/Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import {
    arbeidsperiodeAndreForelderSpørsmålSpråkId,
    ArbeidsperiodeSpørsmålsId,
    arbeidsperiodeSøkerSpørsmålSpråkId,
    hentArbeidsperiodeSpørsmålIder,
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

export const tilIArbeidsperiodeIKontraktFormat = (
    periode: IArbeidsperiode,
    periodeNummer: number,
    gjelderUtlandet: boolean,
    gjelderAndreForelder: boolean,
    tilbakeITid: boolean,
    erAndreForelderDød: boolean
): ISøknadsfelt<IArbeidsperiodeIKontraktFormat> => {
    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeland,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
    } = periode;
    return {
        label: hentTekster(arbeidsperiodeOppsummeringOverskrift(gjelderUtlandet), {
            x: periodeNummer,
        }),
        verdi: sammeVerdiAlleSpråk({
            arbeidsperiodeAvsluttet: arbeidsperiodeAvsluttet
                ? {
                      label: hentTekster(
                          gjelderAndreForelder
                              ? arbeidsperiodeAndreForelderSpørsmålSpråkId(
                                    tilbakeITid,
                                    erAndreForelderDød
                                )[ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet]
                              : arbeidsperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                    ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet
                                ]
                      ),
                      verdi: sammeVerdiAlleSpråk(arbeidsperiodeAvsluttet?.svar),
                  }
                : null,
            arbeidsperiodeland: arbeidsperiodeland
                ? {
                      label: hentTekster(
                          hentArbeidsperiodeSpørsmålIder(
                              gjelderAndreForelder,
                              tilbakeITid,
                              erAndreForelderDød
                          )[ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand]
                      ),
                      verdi: verdiCallbackAlleSpråk(locale =>
                          landkodeTilSpråk(arbeidsperiodeland.svar, locale)
                      ),
                  }
                : null,
            arbeidsgiver: arbeidsgiver
                ? {
                      label: hentTekster(
                          hentArbeidsperiodeSpørsmålIder(
                              gjelderAndreForelder,
                              tilbakeITid,
                              erAndreForelderDød
                          )[ArbeidsperiodeSpørsmålsId.arbeidsgiver]
                      ),
                      verdi: sammeVerdiAlleSpråk(arbeidsgiver.svar),
                  }
                : null,
            fraDatoArbeidsperiode: fraDatoArbeidsperiode
                ? {
                      label: hentTekster(
                          hentArbeidsperiodeSpørsmålIder(
                              gjelderAndreForelder,
                              tilbakeITid,
                              erAndreForelderDød
                          )[ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode]
                      ),
                      verdi: sammeVerdiAlleSpråk(fraDatoArbeidsperiode.svar),
                  }
                : null,
            tilDatoArbeidsperiode: tilDatoArbeidsperiode
                ? {
                      label: hentTekster(
                          hentArbeidsperiodeSpørsmålIder(
                              gjelderAndreForelder,
                              tilbakeITid,
                              erAndreForelderDød
                          )[ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode]
                      ),
                      verdi: sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                          tilDatoArbeidsperiode.svar,
                          'felles.vetikkenåravsluttes.spm'
                      ),
                  }
                : null,
        }),
    };
};
