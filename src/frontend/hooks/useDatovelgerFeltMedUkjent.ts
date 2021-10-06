import { useEffect } from 'react';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { validerDato } from '../utils/dato';

const useDatovelgerFeltMedUkjent = (
    feltId,
    initiellVerdi,
    vetIkkeCheckbox: Felt<ESvar>,
    feilmeldingSpråkId: string,
    skalFeltetVises: boolean,
    nullstillVedAvhengighetEndring = true,
    sluttdatoAvgrensning = '',
    startdatoAvgrensning = ''
) => {
    const datoFelt = useFelt<ISODateString>({
        feltId: feltId,
        verdi: initiellVerdi,
        valideringsfunksjon: (felt: FeltState<string>, avhengigheter) => {
            if (
                avhengigheter &&
                avhengigheter.vetIkkeCheckbox &&
                avhengigheter.vetIkkeCheckbox.verdi === ESvar.JA
            ) {
                return ok(felt);
            }

            const startdatoAvgrensning = avhengigheter && avhengigheter.startdatoAvgrensning;
            const sluttdatoAvgrensning = avhengigheter && avhengigheter.sluttdatoAvgrensning;

            return validerDato(
                felt,
                feilmeldingSpråkId,
                startdatoAvgrensning,
                sluttdatoAvgrensning
            );
        },
        avhengigheter: {
            vetIkkeCheckbox,
            skalFeltetVises,
            startdatoAvgrensning,
            sluttdatoAvgrensning,
        },
        nullstillVedAvhengighetEndring,
        skalFeltetVises: avhengigheter => avhengigheter && avhengigheter.skalFeltetVises,
    });

    useEffect(() => {
        vetIkkeCheckbox.verdi === ESvar.JA &&
            datoFelt.validerOgSettFelt(datoFelt.verdi, vetIkkeCheckbox);
    }, [vetIkkeCheckbox]);

    useEffect(() => {
        skalFeltetVises &&
            datoFelt.verdi !== '' &&
            datoFelt.validerOgSettFelt(datoFelt.verdi, vetIkkeCheckbox);

        return () => {
            !skalFeltetVises && datoFelt.validerOgSettFelt('', vetIkkeCheckbox);
        };
    }, [skalFeltetVises, vetIkkeCheckbox]);

    return datoFelt;
};

export default useDatovelgerFeltMedUkjent;
