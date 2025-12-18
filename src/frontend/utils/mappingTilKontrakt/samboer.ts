import { IKontraktNåværendeSamboer, ISøknadsfelt, TilRestLocaleRecord } from '../../../common/typer/kontrakt/generelle';
import { ISamboer } from '../../typer/person';
import { ITidligereSamoboereTekstinnhold } from '../../typer/sanity/modaler/tidligereSamboere';

import { sammeVerdiAlleSpråk } from './hjelpefunksjoner';

interface SamboerIKontraktFormatParams {
    tekster: ITidligereSamoboereTekstinnhold;
    tilRestLocaleRecord: TilRestLocaleRecord;
    samboer: ISamboer;
}

export const samboerISøknadKontraktFormat = ({
    tekster,
    tilRestLocaleRecord,
    samboer,
}: SamboerIKontraktFormatParams): ISøknadsfelt<IKontraktNåværendeSamboer> => {
    const { ident, samboerFraDato, navn, fødselsdato } = samboer;

    return {
        label: tilRestLocaleRecord(tekster.oppsummeringstittel),
        verdi: sammeVerdiAlleSpråk({
            navn: {
                label: tilRestLocaleRecord(tekster.samboerNavn.sporsmal),
                verdi: sammeVerdiAlleSpråk(navn.svar),
            },
            ident: {
                label: tilRestLocaleRecord(tekster.foedselsnummerEllerDNummer.sporsmal),
                verdi: sammeVerdiAlleSpråk(ident.svar),
            },
            fødselsdato: {
                label: tilRestLocaleRecord(tekster.foedselsdato.sporsmal),
                verdi: sammeVerdiAlleSpråk(fødselsdato.svar),
            },
            samboerFraDato: {
                label: tilRestLocaleRecord(tekster.startdato.sporsmal),
                verdi: sammeVerdiAlleSpråk(samboerFraDato.svar),
            },
        }),
    };
};
