import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { Felt, useFelt } from '@navikt/familie-skjema';

import { ISøknadSpørsmål } from '../../../typer/søknad';
import { validerDato } from '../../../utils/dato';

const useDatovelgerFeltMedJaNeiAvhengighet = (
    søknadsfelt: ISøknadSpørsmål<ISODateString>,
    avhengigSvarCondition: ESvar,
    avhengighet: Felt<ESvar | undefined>,
    avgrensDatoFremITid = false
) => {
    return useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: felt => {
            return validerDato(felt, avgrensDatoFremITid);
        },
        skalFeltetVises: avhengigheter => {
            return avhengigheter && avhengigheter.jaNeiSpm
                ? (avhengigheter.jaNeiSpm as Felt<ESvar | undefined>).verdi ===
                      avhengigSvarCondition
                : true;
        },
        avhengigheter: { jaNeiSpm: avhengighet },
    });
};

export default useDatovelgerFeltMedJaNeiAvhengighet;
