import { ISODateString } from '@navikt/familie-form-elements';
import { useFelt } from '@navikt/familie-skjema';

import { ISøknadSpørsmål } from '../typer/spørsmål';
import { validerDato } from '../utils/dato';

const useDatovelgerFelt = (
    søknadsfelt: ISøknadSpørsmål<ISODateString>,
    skalFeltetVises: boolean,
    feilmeldingSpråkId: string,
    sluttdatoAvgrensning = '',
    startdatoAvgrensning = ''
) => {
    return useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: (felt, avhengigheter) => {
            const startdatoAvgrensning = avhengigheter && avhengigheter.startdatoAvgrensning;
            const sluttdatoAvgrensning = avhengigheter && avhengigheter.sluttdatoAvgrensning;

            return validerDato(
                felt,
                feilmeldingSpråkId,
                startdatoAvgrensning,
                sluttdatoAvgrensning
            );
        },
        skalFeltetVises: () => skalFeltetVises,
        avhengigheter: { sluttdatoAvgrensning, startdatoAvgrensning },
        nullstillVedAvhengighetEndring: false,
    });
};

export default useDatovelgerFelt;
