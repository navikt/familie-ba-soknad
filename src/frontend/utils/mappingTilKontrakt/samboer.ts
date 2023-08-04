import {
    samboerSpråkIder,
    SamboerSpørsmålId,
    TidligereSamboerSpørsmålId,
} from '../../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import { IKontraktNåværendeSamboer, ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { ISamboer } from '../../typer/person';
import { erTidligereSamboer } from '../typeguards';

import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    språktekstIdFraSpørsmålId,
    søknadsfelt,
} from './hjelpefunksjoner';

export const samboerISøknadKontraktFormat = (
    samboer: ISamboer
): ISøknadsfelt<IKontraktNåværendeSamboer> => {
    const { ident, samboerFraDato, navn, fødselsdato } = samboer;
    const erTidligere = erTidligereSamboer(samboer);
    const språktekstIds = {
        navn: språktekstIdFraSpørsmålId(
            erTidligere
                ? TidligereSamboerSpørsmålId.tidligereSamboerNavn
                : SamboerSpørsmålId.nåværendeSamboerNavn
        ),
        ident: språktekstIdFraSpørsmålId(
            erTidligere
                ? TidligereSamboerSpørsmålId.tidligereSamboerFnr
                : SamboerSpørsmålId.nåværendeSamboerFnr
        ),
        fødselsdato: språktekstIdFraSpørsmålId(
            erTidligere
                ? TidligereSamboerSpørsmålId.tidligereSamboerFødselsdato
                : SamboerSpørsmålId.nåværendeSamboerFødselsdato
        ),
        samboerFraDato: språktekstIdFraSpørsmålId(
            erTidligere
                ? TidligereSamboerSpørsmålId.tidligereSamboerFraDato
                : SamboerSpørsmålId.nåværendeSamboerFraDato
        ),
    };
    return søknadsfelt(
        'pdf.samboer.label',
        sammeVerdiAlleSpråk({
            navn: søknadsfelt(språktekstIds.navn, sammeVerdiAlleSpråk(navn.svar)),
            ident: søknadsfelt(
                språktekstIds.ident,
                sammeVerdiAlleSpråkEllerUkjentSpråktekst(ident.svar, samboerSpråkIder.fnrUkjent)
            ),
            fødselsdato: søknadsfelt(
                språktekstIds.fødselsdato,
                sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                    fødselsdato.svar,
                    samboerSpråkIder.fødselsdatoUkjent
                )
            ),
            samboerFraDato: søknadsfelt(
                språktekstIds.samboerFraDato,
                sammeVerdiAlleSpråk(samboerFraDato.svar)
            ),
        })
    );
};
