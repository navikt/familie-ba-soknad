import { ISODateString } from '@navikt/familie-form-elements';
import { useFelt } from '@navikt/familie-skjema';

import { ISøknadSpørsmål } from '../../../typer/søknad';
import { validerDato } from '../../../utils/dato';

const useDatovelgerFelt = (
    søknadsfelt: ISøknadSpørsmål<ISODateString>,
    skalFeltetVises: boolean,
    avgrensDatoFremITid = false
) => {
    return useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: felt => {
            return validerDato(felt, avgrensDatoFremITid);
        },
        skalFeltetVises: () => skalFeltetVises,
    });
};

export default useDatovelgerFelt;
