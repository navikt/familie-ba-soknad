import { ISODateString } from '@navikt/familie-form-elements';
import { Avhengigheter, useFelt } from '@navikt/familie-skjema';

import { ISøknadSpørsmål } from '../typer/spørsmål';
import { validerDato } from '../utils/dato';

const useDatovelgerFelt = (
    søknadsfelt: ISøknadSpørsmål<ISODateString>,
    skalFeltetVises: boolean,
    feilmeldingSpråkId: string,
    sluttdatoAvgrensning = '',
    startdatoAvgrensning = '',
    avhengigheter?: Avhengigheter,
    nullstillVedAvhengighetEndring = false
) => {
    return useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: (felt, avhengigheter) => {
            const startdatoAvgrensning = avhengigheter && avhengigheter.startdatoAvgrensning;
            const sluttdatoAvgrensning = avhengigheter && avhengigheter.sluttdatoAvgrensning;
            const feilmeldingSpråkId = avhengigheter && avhengigheter.feilmeldingSpråkId;

            return validerDato(
                felt,
                feilmeldingSpråkId,
                startdatoAvgrensning,
                sluttdatoAvgrensning
            );
        },
        skalFeltetVises: avhengigheter => avhengigheter?.skalFeltetVises,
        avhengigheter: {
            sluttdatoAvgrensning,
            startdatoAvgrensning,
            skalFeltetVises,
            feilmeldingSpråkId,
            ...avhengigheter,
        },
        nullstillVedAvhengighetEndring,
    });
};

export default useDatovelgerFelt;
