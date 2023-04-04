import { Avhengigheter, useFelt } from '@navikt/familie-skjema';

import { ISODateString } from '../typer/common';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { validerDato } from '../utils/dato';

const useDatovelgerFelt = ({
    søknadsfelt,
    skalFeltetVises,
    feilmeldingSpråkId,
    sluttdatoAvgrensning = undefined,
    startdatoAvgrensning = undefined,
    avhengigheter,
    customStartdatoFeilmelding = '',
    nullstillVedAvhengighetEndring = true,
}: {
    søknadsfelt: ISøknadSpørsmål<ISODateString>;
    skalFeltetVises: boolean;
    feilmeldingSpråkId: string;
    sluttdatoAvgrensning?: Date;
    startdatoAvgrensning?: Date;
    avhengigheter?: Avhengigheter;
    nullstillVedAvhengighetEndring?: boolean;
    customStartdatoFeilmelding?: string;
}) => {
    return useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: (felt, avhengigheter) => {
            const feilmeldingSpråkId = avhengigheter && avhengigheter.feilmeldingSpråkId;

            return validerDato(
                felt,
                feilmeldingSpråkId,
                startdatoAvgrensning,
                sluttdatoAvgrensning,
                customStartdatoFeilmelding
            );
        },
        skalFeltetVises: avhengigheter => avhengigheter?.skalFeltetVises,
        avhengigheter: {
            skalFeltetVises,
            feilmeldingSpråkId,
            ...avhengigheter,
        },
        nullstillVedAvhengighetEndring,
    });
};

export default useDatovelgerFelt;
