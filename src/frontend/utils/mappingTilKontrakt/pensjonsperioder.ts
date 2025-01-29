import { ESvar } from '@navikt/familie-form-elements';

import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { IPensjonsperiodeIKontraktFormat } from '../../typer/kontrakt/kontrakt';
import { IPensjonsperiode } from '../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../typer/personType';
import { IPensjonsperiodeTekstinnhold } from '../../typer/sanity/modaler/pensjonsperiode';
import { landkodeTilSpråk } from '../språk';

import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

interface PensjonsperiodeIKontraktFormatParams {
    periode: IPensjonsperiode;
    periodeNummer: number;
    gjelderUtlandet: boolean;
    tilRestLocaleRecord: TilRestLocaleRecord;
    tekster: IPensjonsperiodeTekstinnhold;
    barn?: IBarnMedISøknad;
}

export const tilIPensjonsperiodeIKontraktFormat = ({
    periode,
    periodeNummer,
    gjelderUtlandet,
    tilRestLocaleRecord,
    tekster,
    barn,
    personType,
    erDød,
}: PensjonsperiodeIKontraktFormatParams &
    PeriodePersonTypeMedBarnProps): ISøknadsfelt<IPensjonsperiodeIKontraktFormat> => {
    const { mottarPensjonNå, pensjonsland, pensjonFra, pensjonTil } = periode;

    const periodenErAvsluttet =
        mottarPensjonNå?.svar === ESvar.NEI || (personType === PersonType.AndreForelder && !!erDød);

    return {
        label: tilRestLocaleRecord(tekster.oppsummeringstittel, {
            antall: periodeNummer.toString(),
            gjelderUtland: gjelderUtlandet,
        }),
        verdi: sammeVerdiAlleSpråk({
            mottarPensjonNå: mottarPensjonNå.svar
                ? {
                      label: tilRestLocaleRecord(tekster.faarPensjonNaa.sporsmal, {
                          barnetsNavn: barn?.navn,
                      }),
                      verdi: sammeVerdiAlleSpråk(mottarPensjonNå.svar),
                  }
                : null,
            pensjonsland: pensjonsland.svar
                ? {
                      label: tilRestLocaleRecord(
                          periodenErAvsluttet
                              ? tekster.pensjonLandFortid.sporsmal
                              : tekster.pensjonLandNaatid.sporsmal,
                          {
                              barnetsNavn: barn?.navn,
                          }
                      ),
                      verdi: verdiCallbackAlleSpråk(locale =>
                          landkodeTilSpråk(pensjonsland.svar, locale)
                      ),
                  }
                : null,
            pensjonFra: pensjonFra.svar
                ? {
                      label: tilRestLocaleRecord(tekster.startdato.sporsmal),
                      verdi: sammeVerdiAlleSpråk(pensjonFra.svar),
                  }
                : null,
            pensjonTil: pensjonTil.svar
                ? {
                      label: tilRestLocaleRecord(
                          periodenErAvsluttet
                              ? tekster.sluttdatoFortid.sporsmal
                              : tekster.sluttdatoFremtid.sporsmal
                      ),
                      verdi: sammeVerdiAlleSpråk(pensjonTil.svar),
                  }
                : null,
        }),
    };
};
