import { ESvar } from '@navikt/familie-form-elements';

import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { IArbeidsperiodeIKontraktFormat } from '../../typer/kontrakt/kontrakt';
import { IArbeidsperiode } from '../../typer/perioder';
import { PeriodePersonTypeProps, PersonType } from '../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../typer/sanity/modaler/arbeidsperiode';
import { landkodeTilSpråk } from '../språk';

import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjent,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';

interface ArbeidsperiodeIKontraktFormatParams {
    periode: IArbeidsperiode;
    periodeNummer: number;
    gjelderUtlandet: boolean;
    tilRestLocaleRecord: TilRestLocaleRecord;
    tekster: IArbeidsperiodeTekstinnhold;
    barn?: IBarnMedISøknad;
}

export const tilIArbeidsperiodeIKontraktFormat = ({
    periode,
    periodeNummer,
    gjelderUtlandet,
    tilRestLocaleRecord,
    tekster,
    barn,
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

    const sluttdatoTekst = periodenErAvsluttet ? tekster.sluttdatoFortid : tekster.sluttdatoFremtid;
    const landTekst = periodenErAvsluttet ? tekster.hvilketLandFortid : tekster.hvilketLandNaatid;

    return {
        label: tilRestLocaleRecord(tekster.oppsummeringstittel, {
            antall: periodeNummer.toString(),
            gjelderUtland: gjelderUtlandet,
        }),
        verdi: sammeVerdiAlleSpråk({
            arbeidsperiodeAvsluttet: arbeidsperiodeAvsluttet.svar
                ? {
                      label: tilRestLocaleRecord(tekster.arbeidsperiodenAvsluttet.sporsmal),
                      verdi: sammeVerdiAlleSpråk(arbeidsperiodeAvsluttet.svar),
                  }
                : null,
            arbeidsperiodeland: arbeidsperiodeland.svar
                ? {
                      label: tilRestLocaleRecord(landTekst.sporsmal, { barnetsNavn: barn?.navn }),
                      verdi: verdiCallbackAlleSpråk(locale =>
                          landkodeTilSpråk(arbeidsperiodeland.svar, locale)
                      ),
                  }
                : null,
            arbeidsgiver: arbeidsgiver.svar
                ? {
                      label: tilRestLocaleRecord(tekster.arbeidsgiver.sporsmal),
                      verdi: sammeVerdiAlleSpråk(arbeidsgiver.svar),
                  }
                : null,
            fraDatoArbeidsperiode: fraDatoArbeidsperiode.svar
                ? {
                      label: tilRestLocaleRecord(tekster.startdato.sporsmal),
                      verdi: sammeVerdiAlleSpråk(fraDatoArbeidsperiode.svar),
                  }
                : null,
            tilDatoArbeidsperiode: tilDatoArbeidsperiode.svar
                ? {
                      label: tilRestLocaleRecord(sluttdatoTekst.sporsmal),
                      verdi: sammeVerdiAlleSpråkEllerUkjent(
                          tilRestLocaleRecord,
                          tilDatoArbeidsperiode.svar,
                          tekster.sluttdatoFremtid.checkboxLabel
                      ),
                  }
                : null,
        }),
    };
};
