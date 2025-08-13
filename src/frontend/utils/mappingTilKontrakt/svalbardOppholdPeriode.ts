import {
    ISvalbardOppholdPeriodeIKontraktFormat,
    ISøknadsfelt,
    TilRestLocaleRecord,
} from '../../typer/kontrakt/generelle';
import { ISvalbardOppholdPeriode } from '../../typer/perioder';
import { ISvalbardOppholdTekstinnhold } from '../../typer/sanity/modaler/svalbardOpphold';

import { sammeVerdiAlleSpråk, sammeVerdiAlleSpråkEllerUkjent } from './hjelpefunksjoner';

interface SvalbardOppholdPeriodeIKontraktFormatParams {
    svalbardOppholdPeriode: ISvalbardOppholdPeriode;
    periodeNummer: number;
    tekster: ISvalbardOppholdTekstinnhold;
    tilRestLocaleRecord: TilRestLocaleRecord;
}
export const svalbardOppholdPeriodeTilISøknadsfelt = ({
    svalbardOppholdPeriode,
    periodeNummer,
    tekster,
    tilRestLocaleRecord,
}: SvalbardOppholdPeriodeIKontraktFormatParams): ISøknadsfelt<ISvalbardOppholdPeriodeIKontraktFormat> => {
    return {
        label: tilRestLocaleRecord(tekster.oppsummeringstittel, {
            antall: periodeNummer.toString(),
        }),
        verdi: sammeVerdiAlleSpråk({
            fraDato: {
                label: tilRestLocaleRecord(tekster.startdato.sporsmal),
                verdi: sammeVerdiAlleSpråk(svalbardOppholdPeriode.fraDatoSvalbardOpphold.svar),
            },
            tilDato: {
                label: tilRestLocaleRecord(tekster.sluttdato.sporsmal),
                verdi: sammeVerdiAlleSpråkEllerUkjent(
                    tilRestLocaleRecord,
                    svalbardOppholdPeriode.tilDatoSvalbardOpphold.svar,
                    tekster.sluttdato.checkboxLabel
                ),
            },
        }),
    };
};
